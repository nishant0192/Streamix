import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const getVideoStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const videoStats = await prisma.videoStats.findUnique({
            where: { videoId }
        });

        if (!videoStats) {
            return res.status(404).json({ message: 'Video stats not found' });
        }
        const statsForResponse = {
            videoId: videoStats.videoId,
            views: videoStats.views.toString(),
            likes: videoStats.likes.toString(),
            dislikes: videoStats.dislikes.toString(),
            shares: videoStats.shares.toString(),
            hoursWatched: videoStats.hoursWatched.toString(),
            createdAt: videoStats.createdAt.toISOString(),
            updatedAt: videoStats.updatedAt.toISOString()
        };

        return res.status(200).json(statsForResponse);
    } catch (error) {
        console.error('Error in getVideoStats:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
};
