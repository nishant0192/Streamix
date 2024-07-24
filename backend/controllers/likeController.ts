import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from "../utils/type";
import dotenv from "dotenv";
import { PrismaClient } from '@prisma/client';
import { updateLike, updateunLike, updateDislike, updateunDislike } from "./updateStats";

dotenv.config();

const prisma = new PrismaClient();

export const like = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const existingDislike = await prisma.dislikes.findFirst({
            where: {
                videoId,
                userId: user.id
            }
        });

        const existingLike = await prisma.likes.findFirst({
            where: {
                videoId,
                userId: user.id
            }
        });

        if (existingDislike) {
            await prisma.dislikes.delete({
                where: {
                    id: existingDislike.id
                }
            });
            await updateunDislike(videoId);
        }

        if (!existingLike) {
            await prisma.likes.create({
                data: {
                    videoId,
                    userId: user.id
                }
            });
            const updatedVideo = await updateLike(videoId);
            return res.status(201).json(updatedVideo);
        } else {
            await prisma.likes.delete({
                where: {
                    id: existingLike.id
                }
            });
            const updatedVideo = await updateunLike(videoId);
            return res.status(200).json({ message: 'User already liked this video, removed the like', ...updatedVideo });
        }
    } catch (error) {
        console.error('Error in like:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
};
