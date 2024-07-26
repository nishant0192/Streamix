import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from "../utils/type";
import { prisma } from "../config/db"

type JsonObject = { [key: string]: any };

const convertBigIntPropertiesToString = (obj: any): JsonObject => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(convertBigIntPropertiesToString);

    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key,
            typeof value === 'bigint' ? value.toString() : convertBigIntPropertiesToString(value),
        ])
    );
};

export const share = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { videoId, channelId } = req.body;

        // Check if either videoId or channelId is provided
        if (!videoId && !channelId) {
            return res.status(400).json({ message: 'Invalid request: videoId or channelId must be provided' });
        }

        // Handle sharing for videoId
        if (videoId) {
            const video = await prisma.videos.findUnique({
                where: { id: videoId }
            });

            if (!video) {
                return res.status(404).json({ message: 'Video not found' });
            }

            let videoStats = await prisma.videoStats.findUnique({
                where: { videoId: videoId }
            });

            if (!videoStats) {
                // Create new VideoStats if not found
                videoStats = await prisma.videoStats.create({
                    data: {
                        videoId: videoId,
                        shares: BigInt(1)
                    }
                });
            } else {
                // Update shares if VideoStats exists
                videoStats = await prisma.videoStats.update({
                    where: { videoId: videoId },
                    data: {
                        shares: BigInt(videoStats.shares) + BigInt(1)
                    }
                });
            }

            const videoStatsJson = convertBigIntPropertiesToString(videoStats);
            return res.status(200).json(videoStatsJson);
        }

        // Handle sharing for channelId
        if (channelId) {
            const channel = await prisma.channels.findUnique({
                where: { channelId: channelId }
            });

            if (!channel) {
                return res.status(404).json({ message: 'Channel not found' });
            }

            let channelStats = await prisma.channelStats.findUnique({
                where: { channelId: channelId }
            });

            if (!channelStats) {
                // Create new ChannelStats if not found
                channelStats = await prisma.channelStats.create({
                    data: {
                        channelId: channelId,
                        shares: BigInt(1)
                    }
                });
            } else {
                // Update shares if ChannelStats exists
                channelStats = await prisma.channelStats.update({
                    where: { channelId: channelId },
                    data: {
                        shares: BigInt(channelStats.shares) + BigInt(1)
                    }
                });
            }

            const channelStatsJson = convertBigIntPropertiesToString(channelStats);
            return res.status(200).json(channelStatsJson);
        }

        return res.status(400).json({ message: 'Invalid request' });

    } catch (error) {
        console.error('Error in share:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        await prisma.$disconnect();
    }
};
