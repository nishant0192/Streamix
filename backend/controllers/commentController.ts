import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Users } from '../models/Users';
import { Videos } from '../models/Videos';
import { Comments } from '../models/Comments';
import { AuthRequest } from "../utils/type";
import { Channel } from '../models/Channels';
export const getComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { videoId } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const videoComments = await Comments.findAll({
            where: {
                videoId: videoId
            },
        })

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
        console.log(content)
        const videoComment = await Comments.create({
            userId: user.id,
            videoId,
            content
        })

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

        const videoComment = await Comments.findOne({
            where: {
                id: commentId
            }
        })
        console.log("hi", videoComment)
        if (videoComment) {
            if (videoComment.userId === user.id) {

                return res.status(200).json({ message: "Comment a" });
            }
            const video = await Videos.findOne({
                where: {
                    id: videoId
                }
            })
            console.log(video)
            if (video) {
                const videoAdmin = await Channel.findOne({
                    where: {
                        channelId: video.channelId
                    }
                })
                console.log(videoAdmin)
                if (videoAdmin && user.id === videoAdmin.userId) {
                    return res.status(200).json({ message: "Comment Deleted By Admin" });
                }
            }
        }

        return res.status(200).json({ message: "Can't Delete this comment" });
    } catch (error) {
        console.error('Error in comments:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
