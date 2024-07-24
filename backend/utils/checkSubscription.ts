import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const isUserSubscribed = async (type: 'channel' | 'video', id: string, userId: string): Promise<boolean> => {
    if (type === 'channel') {
        const channelSubs = await prisma.channelSubscribers.findUnique({
            where: { channelId: id }
        });
        return !!channelSubs && channelSubs.subscriberUserIds.includes(userId);
    } else if (type === 'video') {
        const videoSubs = await prisma.videoSubscribers.findUnique({
            where: { videoId: id }
        });
        return !!videoSubs && videoSubs.subscriberUserIds.includes(userId);
    } else {
        throw new Error('Invalid subscription type');
    }
};
