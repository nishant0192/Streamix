import express, { Request, Response, NextFunction } from 'express';
import { AuthRequest } from "../utils/type";
import dotenv from 'dotenv';
import { sequelize } from '../config/db';
import { Videos } from '../models/Videos';
import { Channels } from '../models/Channels';
import multer from 'multer';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const router = express.Router();
const recordingsDir = path.join(__dirname, '..', 'recordings');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'recordings'));
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

        const channel = await Channels.findOne({
            where: {
                userId: user.id,
            }
        })

        const channelId = channel?.channelId;
        const description = 'Description of the video';
        const videoPrivacy = 'unlisted';

        const fileId = uuidv4(); // Generate UUID for fileId

        const videoInfo = {
            title: fileName,
            extension: 'mp4',
            fileId: fileId,
            channelId,
            description,
            videoPrivacy,
        };

        await sequelize.transaction(async (transaction) => {
            await Videos.create(videoInfo, { transaction });
            await Channels.update(
                { /* Update fields */ },
                { where: { channelId }, transaction }
            );
        });

        res.json({ videoURL: `${process.env.BACKEND_URL}/recordings/${fileName}.mp4` });
    } catch (error: any) {
        console.error('Error handling upload:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const fetchVideos = (req: Request, res: Response) => {
    try {
        const files: string[] = fs.readdirSync(recordingsDir);
        const videos: string[] = files.map((file) => `${process.env.BACKEND_URL}/recordings/${file}`);
        res.json({ videos });
    } catch (error: any) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const videosInfo = async (req: Request, res: Response) => {
    try {
        const videos = await Videos.findAll({
            attributes: ['fileId', 'title'],
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
