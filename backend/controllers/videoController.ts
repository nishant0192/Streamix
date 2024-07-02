import axios from "axios";
import express, { Request, Response, Router } from "express";
import dotenv from "dotenv";
import { sequelize } from '../config/db';
import { Videos } from '../models/Videos';
import { Channel } from '../models/Channels';
import multer from "multer";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { StringSession } from "telegram/sessions";
import input from "input";
import e from "express";

dotenv.config();

const BOT_TOKEN: string = process.env.BOT_TOKEN || "";
const BASE_URL: string = `https://api.telegram.org/bot${BOT_TOKEN}/`;
const router: Router = express.Router();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const apiId: number = parseInt(process.env.TG_API_ID || '', 10);
const apiHash = process.env.TG_API_HASH || '';
const stringSession = new StringSession(process.env.TG_STRING_SESSION || '');
const apiEndpoint: string = process.env.BACKEND_URL || "";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "recordings"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
const recordingsDir: string = path.join(__dirname, "..", "recordings");

// Functions
async function extractVideoInfo(): Promise<void> {
    try {
        const response = await axios.get(`${BASE_URL}getUpdates`);
        const updates = response.data.result;

        const videoInfoData = await Promise.all(
            updates
                .filter((update: any) => update.message && update.message.video)
                .map(async (update: any) => {
                    const { file_id, file_name } = update.message.video;
                    console.log(`Processing file_id: ${file_id}`);

                    const telegramFileId = file_id;
                    const extension = file_name.split(".").pop();
                    const title = file_name.split(".").slice(0, -1).join(".");
                    const channelId = "71mkCD";
                    const description = "adsada";
                    const videoPrivacy = "unlisted";

                    const channel = await Channel.findOne({
                        where: { channelId: channelId }
                    });
                    console.log(channel)

                    if (!channel) {
                        console.error(`Channel with id ${channelId} not found`);
                        return null;
                    }

                    const noOfVideos = channel.noOfVideos;
                    return {
                        title,
                        extension,
                        file_id,
                        telegramFileId,
                        channelId,
                        description,
                        videoPrivacy,
                        noOfVideos
                    };
                })
        );

        const filteredVideoInfoData = videoInfoData.filter(data => data !== null);

        if (filteredVideoInfoData.length > 0) {
            await sequelize.transaction(async (transaction) => {
                await Promise.all(
                    filteredVideoInfoData.map(async (data: any) => {
                        console.log(`Checking existence of file_id: ${data.file_id}`);
                        if (data.file_id) {
                            const existingVideo = await Videos.findOne({
                                where: { telegramFileId: data.file_id },
                                transaction
                            });

                            if (!existingVideo) {
                                console.log(`Creating new video entry for file_id: ${data.file_id}`);
                                await Videos.create(data, { transaction });
                                await Channel.update(
                                    { noOfVideos: data.noOfVideos + 1 },
                                    {
                                        where: { channelId: data.channelId },
                                        transaction
                                    }
                                );
                            } else {
                                console.log(`Video with file_id: ${data.file_id} already exists`);
                            }
                        }
                    })
                );
            });
            console.log("Video information extracted and saved to PostgreSQL database");
        } else {
            console.log("No new video information to process");
        }
    } catch (error) {
        console.error("Error:", (error as Error).message);
    }
}

async function saveVideoLocally(videoBuffer: Buffer, filename: string): Promise<string> {
    const filePath = path.join(recordingsDir, filename);
    await fs.promises.writeFile(filePath, videoBuffer);
    return filePath;
}

async function fetchVideosFromDirectory(directoryPath: string): Promise<string[]> {
    const files = await fs.promises.readdir(directoryPath);
    return files.filter(file => file.endsWith('.mp4'));
}

async function sendFileToTelegram(
    filePath: string,
    fileName: string,
    chatId: string,
    onProgressCallback: (progress: number) => void
): Promise<any> {
    try {
        const { TelegramClient } = require("telegram");
        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
        });

        await client.start({
            phoneNumber: async () => await input.text("Please enter your number: "),
            password: async () => await input.text("Please enter your password: "),
            phoneCode: async () => await input.text("Please enter the code you received: "),
            onError: (err: any) => console.log(err),
        });

        const message = await client.sendFile(
            chatId,
            { file: filePath },
            {
                onUploadProgress: (progressEvent: any) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    console.log(progress);
                    onProgressCallback(progress);
                },
            }
        );

        console.log("Video uploaded to Telegram successfully");
        extractVideoInfo()
        fs.unlinkSync(filePath);

        return message;
    } catch (error) {
        console.error("Error uploading file to Telegram:", error);
        throw error;
    }
}

const recordVideos = async (req: Request, res: Response) => {
    try {
        const file: any = req.file;
        const fileName: string = req.body.fileName;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        if (!fileName || fileName.trim() === "") {
            return res.status(400).json({ error: "Invalid file name" });
        }

        const inputPath: string = file.path;
        const outputPath: string = path.join(recordingsDir, `${fileName}.mp4`);

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputPath)
                .output(outputPath)
                .on("end", () => {
                    fs.unlinkSync(inputPath);
                    resolve();
                })
                .on("error", (error) =>
                    reject(new Error(`Error converting video: ${error.message}`))
                )
                .run();
        });

        const chatId: string = "@video_recoreder_bot";

        const onProgressCallback = (progress: number) => {
            console.log(`Upload progress: ${progress}%`);
        };
        await extractVideoInfo();
        await sendFileToTelegram(outputPath, fileName, chatId, onProgressCallback);

        res.json({ videoURL: `${apiEndpoint}/recordings/${fileName}.mp4` });
    } catch (error) {
        console.error("Error handling upload:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const fetchVideos = (req: Request, res: Response) => {
    try {
        const files: string[] = fs.readdirSync(recordingsDir);
        const videos: string[] = files.map((file) => `${apiEndpoint}/recordings/${file}`);
        res.json({ videos });
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const videosInfo = async (req: Request, res: Response) => {
    try {
        const videos = await Videos.findAll({
            attributes: ['telegramFileId', 'title'],
        });

        const fileIdsAndNames = await Promise.all(
            videos.map(async (video) => {
                try {
                    const response = await axios.get(
                        `${TELEGRAM_API_URL}/getFile`,
                        {
                            params: {
                                file_id: video.telegramFileId,
                            },
                        }
                    );
                    const filePath = response.data.result.file_path;
                    const videoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

                    return {
                        id: video.telegramFileId,
                        name: video.title,
                        url: videoUrl,
                    };
                } catch (error) {
                    console.error(
                        `Error fetching video with file_id ${video.telegramFileId}:`,
                        error
                    );
                    return null;
                }
            })
        );
        const filteredVideos = fileIdsAndNames.filter((video) => video !== null);

        res.json({ videos: filteredVideos });
    } catch (error) {
        console.error('Error:', (error as Error).message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default videosInfo;


export { extractVideoInfo, saveVideoLocally, fetchVideosFromDirectory, sendFileToTelegram, recordVideos, fetchVideos, videosInfo };
