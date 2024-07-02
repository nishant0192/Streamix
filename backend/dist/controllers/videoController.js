"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosInfo = exports.fetchVideos = exports.recordVideos = exports.sendFileToTelegram = exports.fetchVideosFromDirectory = exports.saveVideoLocally = exports.extractVideoInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../config/db");
const Video_1 = require("../models/Video");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = __importDefault(require("fs"));
const sessions_1 = require("telegram/sessions");
const input_1 = __importDefault(require("input"));
dotenv_1.default.config();
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}/`;
const router = express_1.default.Router();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const apiId = parseInt(process.env.TG_API_ID || '', 10);
const apiHash = process.env.TG_API_HASH || '';
const stringSession = new sessions_1.StringSession(process.env.TG_STRING_SESSION || '');
const apiEndpoint = process.env.BACKEND_URL || "";
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "..", "recordings"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer_1.default({ storage: storage });
const recordingsDir = path_1.default.join(__dirname, "..", "recordings");
// Functions
function extractVideoInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${BASE_URL}getUpdates`);
            const updates = response.data.result;
            const videoInfoData = updates
                .filter((update) => update.message && update.message.video)
                .map((update) => {
                const { file_id, file_name } = update.message.video;
                console.log(file_id);
                const telegram_file_id = file_id;
                const extension = file_name.split(".").pop();
                const title = file_name.split(".").slice(0, -1).join(".");
                // const channel_id = "sdwq2e";
                // const userid = update.message.from.id;
                return { title, extension, file_id, telegram_file_id };
            });
            if (videoInfoData.length > 0) {
                yield db_1.sequelize.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                    yield Promise.all(videoInfoData.map((data) => __awaiter(this, void 0, void 0, function* () {
                        if (data.file_id) {
                            const existingVideo = yield Video_1.Video.findOne({
                                where: { telegram_file_id: data.file_id },
                                transaction,
                            });
                            if (!existingVideo) {
                                yield Video_1.Video.create(data, { transaction });
                            }
                        }
                    })));
                }));
                console.log("Video information extracted and saved to PostgreSQL database");
            }
        }
        catch (error) {
            console.error("Error:", error.message);
        }
    });
}
exports.extractVideoInfo = extractVideoInfo;
extractVideoInfo();
function saveVideoLocally(videoBuffer, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.join(recordingsDir, filename);
        yield fs_1.default.promises.writeFile(filePath, videoBuffer);
        return filePath;
    });
}
exports.saveVideoLocally = saveVideoLocally;
function fetchVideosFromDirectory(directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield fs_1.default.promises.readdir(directoryPath);
        return files.filter(file => file.endsWith('.mp4'));
    });
}
exports.fetchVideosFromDirectory = fetchVideosFromDirectory;
function sendFileToTelegram(filePath, fileName, chatId, onProgressCallback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { TelegramClient } = require("telegram");
            const client = new TelegramClient(stringSession, apiId, apiHash, {
                connectionRetries: 5,
            });
            yield client.start({
                phoneNumber: () => __awaiter(this, void 0, void 0, function* () { return yield input_1.default.text("Please enter your number: "); }),
                password: () => __awaiter(this, void 0, void 0, function* () { return yield input_1.default.text("Please enter your password: "); }),
                phoneCode: () => __awaiter(this, void 0, void 0, function* () { return yield input_1.default.text("Please enter the code you received: "); }),
                onError: (err) => console.log(err),
            });
            const message = yield client.sendFile(chatId, { file: filePath }, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(progress);
                    onProgressCallback(progress);
                },
            });
            console.log("Video uploaded to Telegram successfully");
            fs_1.default.unlinkSync(filePath);
            return message;
        }
        catch (error) {
            console.error("Error uploading file to Telegram:", error);
            throw error;
        }
    });
}
exports.sendFileToTelegram = sendFileToTelegram;
const recordVideos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const fileName = req.body.fileName;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        if (!fileName || fileName.trim() === "") {
            return res.status(400).json({ error: "Invalid file name" });
        }
        const inputPath = file.path;
        const outputPath = path_1.default.join(recordingsDir, `${fileName}.mp4`);
        yield new Promise((resolve, reject) => {
            fluent_ffmpeg_1.default(inputPath)
                .output(outputPath)
                .on("end", () => {
                fs_1.default.unlinkSync(inputPath);
                resolve();
            })
                .on("error", (error) => reject(new Error(`Error converting video: ${error.message}`)))
                .run();
        });
        const chatId = "@video_recoreder_bot";
        const onProgressCallback = (progress) => {
            console.log(`Upload progress: ${progress}%`);
        };
        yield extractVideoInfo();
        yield sendFileToTelegram(outputPath, fileName, chatId, onProgressCallback);
        res.json({ videoURL: `${apiEndpoint}/recordings/${fileName}.mp4` });
    }
    catch (error) {
        console.error("Error handling upload:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.recordVideos = recordVideos;
const fetchVideos = (req, res) => {
    try {
        const files = fs_1.default.readdirSync(recordingsDir);
        const videos = files.map((file) => `${apiEndpoint}/recordings/${file}`);
        res.json({ videos });
    }
    catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.fetchVideos = fetchVideos;
const videosInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videos = yield Video_1.Video.findAll({
            attributes: ['telegram_file_id', 'title'],
        });
        const fileIdsAndNames = yield Promise.all(videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${TELEGRAM_API_URL}/getFile`, {
                    params: {
                        file_id: video.telegram_file_id,
                    },
                });
                const filePath = response.data.result.file_path;
                const videoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
                return {
                    id: video.telegram_file_id,
                    name: video.title,
                    url: videoUrl,
                };
            }
            catch (error) {
                console.error(`Error fetching video with file_id ${video.telegram_file_id}:`, error);
                return null;
            }
        })));
        const filteredVideos = fileIdsAndNames.filter((video) => video !== null);
        res.json({ videos: filteredVideos });
    }
    catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.videosInfo = videosInfo;
exports.default = videosInfo;
