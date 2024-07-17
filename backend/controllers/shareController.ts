import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from "../utils/type";
import { Videos } from '../models/Videos';
import { Channels } from '../models/Channels';
import { VideoStats } from '../models/VideoStats';
import { ChannelStats } from '../models/ChannelStats';

export const share = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { videoId, channelId } = req.body;

        // Check if either videoId or channelId is provided
        if (!videoId && !channelId) {
            return res.status(400).json({ message: 'Invalid request: videoId or channelId must be provided' });
        }

        // Handle sharing for videoId
        if (videoId) {
            const video = await Videos.findOne({
                where: { id: videoId }
            });

            if (!video) {
                return res.status(404).json({ message: 'Video not found' });
            }

            let videoStats = await VideoStats.findOne({
                where: { videoId: videoId }
            });

            if (!videoStats) {
                // Create new VideoStats if not found
                videoStats = await VideoStats.create({
                    videoId: videoId,
                    shares: BigInt(1)
                });
            } else {
                // Update shares if VideoStats exists
                videoStats.shares = videoStats.shares ? BigInt(videoStats.shares) + BigInt(1) : BigInt(1);
                await videoStats.save();
            }

            const videoStatsJson = {
                ...videoStats.toJSON(),
                shares: videoStats.shares.toString()
            };

            return res.status(200).json(videoStatsJson);
        }

        // Handle sharing for channelId
        if (channelId) {
            const channel = await Channels.findOne({
                where: { channelId: channelId }
            });

            if (!channel) {
                return res.status(404).json({ message: 'Channel not found' });
            }

            let channelStats = await ChannelStats.findOne({
                where: { channelId: channelId }
            });

            if (!channelStats) {
                // Create new ChannelStats if not found
                channelStats = await ChannelStats.create({
                    channelId: channelId,
                    shares: BigInt(1)
                });
            } else {
                // Update shares if ChannelStats exists
                channelStats.shares = channelStats.shares ? BigInt(channelStats.shares) + BigInt(1) : BigInt(1);
                await channelStats.save();
            }

            const channelStatsJson = {
                ...channelStats.toJSON(),
                shares: channelStats.shares.toString()
            };

            return res.status(200).json(channelStatsJson);
        }

        return res.status(400).json({ message: 'Invalid request' });

    } catch (error) {
        console.error('Error in share:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
