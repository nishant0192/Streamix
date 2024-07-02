import { VideoStats } from '../models/VideoStats';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from "../utils/type";
import dotenv from "dotenv";
import { updateLike } from "./updateStats";
import { Likes } from "../models/Likes";
dotenv.config();

export const getVideoStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body;

        const videoStats = await VideoStats.findOne({ where: { videoId } });

        if (!videoStats) {
            return res.status(404).json({ message: 'Video stats not found' });
        }

        // Convert likes from BigInt to string for JSON response
        const statsForResponse = {
            videoId: videoStats.videoId,
            views: videoStats.views.toString(),
            likes: videoStats.likes.toString(),
            dislikes: videoStats.dislikes.toString(),
            shares: videoStats.shares.toString(),
            hoursWatched: videoStats.hoursWatched.toString(),
            createdAt: videoStats.createdAt,
            updatedAt: videoStats.updatedAt
        };

        return res.status(200).json(statsForResponse);
    } catch (error) {
        console.error('Error in getVideoStats:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
