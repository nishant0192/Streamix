import express, { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/type';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "../config/db";

dotenv.config();
const router = express.Router();
const recordingsDir = path.join(__dirname, '..', 'recordings');

// Setup multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, recordingsDir);
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Endpoint for recording videos
const recordVideos = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const file = req.file; // multer will put the file in req.file
        const user = req.user;
        const fileName: string = req.body.fileName;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!fileName || fileName.trim() === '') {
            return res.status(400).json({ error: 'Invalid file name' });
        }

        const inputPath: string = file.path;
        const fileId = uuidv4();
        const outputPath: string = path.join(recordingsDir, `${fileId}.mp4`);

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

        res.json({ videoURL: `${process.env.BACKEND_URL}/recordings/${fileId}.mp4` });
    } catch (error: any) {
        console.error('Error handling upload:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Endpoint to fetch video data
const fetchVideos = async (req: Request, res: Response) => {
    try {
        const videos = await prisma.videos.findMany({
            select: {
                id: true,
                title: true,
                extension: true,
                fileId: true,
                createdAt: true,
                Channel: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const formattedVideos = videos.map((video) => ({
            id: video.id,
            url: `${process.env.BACKEND_API}/recordings/${video.fileId}.${video.extension}`,
            title: video.title,
            channelName: video.Channel?.name,
        }));

        res.json({ videos: formattedVideos });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Endpoint to get basic video information
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
