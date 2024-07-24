import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../utils/type';

const prisma = new PrismaClient();

export const getComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const videoComments = await prisma.comments.findMany({
            where: {
                videoId: videoId,
            },
        });

        return res.status(200).json(videoComments);
    } catch (error) {
        console.error('Error in comments:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const addComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { videoId, content } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const videoComment = await prisma.comments.create({
            data: {
                userId: user.id,
                videoId,
                content,
            },
        });

        return res.status(200).json(videoComment);
    } catch (error) {
        console.error('Error in comments:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { videoId, commentId } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const videoComment = await prisma.comments.findUnique({
            where: {
                id: commentId,
            },
        });

        if (videoComment) {
            if (videoComment.userId === user.id) {
                // Allow the comment owner to delete their comment
                await prisma.comments.delete({
                    where: {
                        id: commentId,
                    },
                });
                return res.status(200).json({ message: "Comment deleted successfully" });
            }

            const video = await prisma.videos.findUnique({
                where: {
                    id: videoId,
                },
            });

            if (video) {
                const videoAdmin = await prisma.channels.findUnique({
                    where: {
                        channelId: video.channelId,
                    },
                });

                if (videoAdmin && user.id === videoAdmin.userId) {
                    // Allow the channel admin to delete any comment
                    await prisma.comments.delete({
                        where: {
                            id: commentId,
                        },
                    });
                    return res.status(200).json({ message: "Comment deleted by admin" });
                }
            }
        }

        return res.status(403).json({ message: "Can't delete this comment" });
    } catch (error) {
        console.error('Error in comments:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
