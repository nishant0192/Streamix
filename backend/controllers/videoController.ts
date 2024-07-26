import express, { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/type';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "../config/db"

dotenv.config();
const router = express.Router();
const recordingsDir = path.join(__dirname, '..', 'recordings');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, recordingsDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const recordVideos = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const file: any = req.file;
        const user = req.user;
        const fileName: string = req.body.fileName;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!fileName || fileName.trim() === '') {
            return res.status(400).json({ error: 'Invalid file name' });
        }

        const inputPath: string = file.path;
        const outputPath: string = path.join(recordingsDir, `${fileName}.mp4`);
        console.log(user.id);
        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputPath)
                .output(outputPath)
                .on('end', () => {
                    fs.unlinkSync(inputPath);
                    resolve();
                })
                .on('error', (error) =>
                    reject(new Error(`Error converting video: ${error.message}`))
                )
                .run();
        });

        const channel = await prisma.channels.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        const channelId = channel.channelId;
        const description = 'Description of the video';
        const videoPrivacy = 'unlisted';

        const fileId = uuidv4();

        await prisma.videos.create({
            data: {
                title: fileName,
                extension: 'mp4',
                fileId: fileId,
                channelId,
                description,
                videoPrivacy,
            },
        });

        res.json({ videoURL: `${process.env.BACKEND_URL}/recordings/${fileName}.mp4` });
    } catch (error: any) {
        console.error('Error handling upload:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const fetchVideos = async (req: Request, res: Response) => {
    try {
        const videos = await prisma.videos.findMany({
            select: {
                id: true,
                title: true,
                extension: true,
                createdAt: true,
                Channel: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // Format the video data
        const formattedVideos = videos.map((video) => ({
            id: video.id,
            url: `${process.env.BACKEND_API}/recordings/${encodeURIComponent(video.title)}.${video.extension}`,
            title: video.title,
            channelName: video.Channel?.name,
        }));

        res.json({ videos: formattedVideos });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const videosInfo = async (req: Request, res: Response) => {
    try {
        const videos = await prisma.videos.findMany({
            select: {
                fileId: true,
                title: true,
            },
        });

        res.json({ videos });
    } catch (error: any) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export {
    recordVideos,
    fetchVideos,
    videosInfo,
};
