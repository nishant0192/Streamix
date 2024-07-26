import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from "../utils/type";
import dotenv from "dotenv";
import { updateDislike, updateunDislike, updateLike, updateunLike } from "./updateStats";
import { prisma } from "../config/db"

dotenv.config();

export const dislike = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

        // Check if the user has already liked or disliked the video
        const existingLike = await prisma.likes.findUnique({
            where: {
                videoId_userId: {
                    videoId,
                    userId: user.id
                }
            }
        });

        const existingDislike = await prisma.dislikes.findUnique({
            where: {
                videoId_userId: {
                    videoId,
                    userId: user.id
                }
            }
        });

        // Remove the like if it exists
        if (existingLike) {
            await prisma.likes.delete({
                where: {
                    videoId_userId: {
                        videoId,
                        userId: user.id
                    }
                }
            });
            await updateunLike(videoId);
        }

        // Add or remove dislike based on current status
        if (!existingDislike) {
            // Add dislike
            await prisma.dislikes.create({
                data: {
                    videoId,
                    userId: user.id
                }
            });
            const updatedVideo = await updateDislike(videoId);
            return res.status(201).json(updatedVideo);
        } else {
            // Remove dislike
            await prisma.dislikes.delete({
                where: {
                    videoId_userId: {
                        videoId,
                        userId: user.id
                    }
                }
            });
            const updatedVideo = await updateunDislike(videoId);
            return res.status(200).json({ message: 'User already disliked this video, removed the dislike', ...updatedVideo });
        }
    } catch (error) {
        console.error('Error in dislike:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        // Ensure the Prisma Client is disconnected after the operation
        await prisma.$disconnect();
    }
};
