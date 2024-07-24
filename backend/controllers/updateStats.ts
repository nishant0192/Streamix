import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { isUserSubscribed } from '../utils/checkSubscription';

dotenv.config();

const prisma = new PrismaClient();

const convertBigIntPropertiesToString = (video: any) => {
    return {
        ...video,
        views: video.views.toString(),
        likes: video.likes.toString(),
        dislikes: video.dislikes.toString(),
        shares: video.shares.toString(),
        hoursWatched: video.hoursWatched.toString()
    };
};

export const updateLike = async (videoId: string) => {
    try {
        let video = await prisma.videoStats.findUnique({
            where: { videoId }
        });

        if (!video) {
            video = await prisma.videoStats.create({
                data: {
                    videoId,
                    likes: BigInt(1),
                    dislikes: BigInt(0),
                    views: BigInt(0),
                    shares: BigInt(0),
                    hoursWatched: BigInt(0)
                }
            });
            console.log('New video stats created:', video);
        } else {
            video.likes = BigInt(video.likes) + BigInt(1);
            await prisma.videoStats.update({
                where: { videoId },
                data: { likes: video.likes }
            });
        }

        return convertBigIntPropertiesToString(video);
    } catch (error) {
        console.error('Error in updateLike:', error);
        throw new Error('Internal server error');
    }
};

export const updateunLike = async (videoId: string) => {
    try {
        const video = await prisma.videoStats.findUnique({
            where: { videoId }
        });

        if (video) {
            video.likes = BigInt(video.likes) - BigInt(1);
            if (video.likes < BigInt(0)) video.likes = BigInt(0);
            await prisma.videoStats.update({
                where: { videoId },
                data: { likes: video.likes }
            });
            console.log('Video stats updated:', video);
        }

        return video ? convertBigIntPropertiesToString(video) : { videoId, likes: "0", dislikes: "0", views: "0", shares: "0", hoursWatched: "0" };
    } catch (error) {
        console.error('Error in updateunLike:', error);
        throw new Error('Internal server error');
    }
};

export const updateDislike = async (videoId: string) => {
    try {
        let video = await prisma.videoStats.findUnique({
            where: { videoId }
        });

        if (!video) {
            video = await prisma.videoStats.create({
                data: {
                    videoId,
                    likes: BigInt(0),
                    dislikes: BigInt(1),
                    views: BigInt(0),
                    shares: BigInt(0),
                    hoursWatched: BigInt(0)
                }
            });
            console.log('New video stats created:', video);
        } else {
            video.dislikes = BigInt(video.dislikes) + BigInt(1);
            await prisma.videoStats.update({
                where: { videoId },
                data: { dislikes: video.dislikes }
            });
        }

        return convertBigIntPropertiesToString(video);
    } catch (error) {
        console.error('Error in updateDislike:', error);
        throw new Error('Internal server error');
    }
};

export const updateunDislike = async (videoId: string) => {
    try {
        const video = await prisma.videoStats.findUnique({
            where: { videoId }
        });

        if (video) {
            video.dislikes = BigInt(video.dislikes) - BigInt(1);
            if (video.dislikes < BigInt(0)) video.dislikes = BigInt(0);
            await prisma.videoStats.update({
                where: { videoId },
                data: { dislikes: video.dislikes }
            });
            console.log('Video stats updated:', video);
        }

        return video ? convertBigIntPropertiesToString(video) : { videoId, likes: "0", dislikes: "0", views: "0", shares: "0", hoursWatched: "0" };
    } catch (error) {
        console.error('Error in updateunDislike:', error);
        throw new Error('Internal server error');
    }
};

export const updateSubs = async (videoId: string, channelId: string, user: { id: string }, source?: string) => {
    try {
        // Check if the channel exists
        const channel = await prisma.channels.findUnique({
            where: { channelId }
        });

        if (!channel) {
            throw new Error('Channel does not exist');
        }

        // Check if user is already subscribed to the channel
        const isSubscribedToChannel = await isUserSubscribed('channel', channelId, user.id);
        if (!isSubscribedToChannel) {
            await prisma.channelSubscribers.upsert({
                where: { channelId },
                update: {
                    subscriberUserIds: { push: user.id }
                },
                create: {
                    channelId,
                    subscriberUserIds: [user.id]
                }
            });
            console.log('Subscriber added/updated for channel:', channelId);
        }

        if (source === 'videoId') {
            // Check if user is already subscribed to the video
            const isSubscribedToVideo = await isUserSubscribed('video', videoId, user.id);
            if (!isSubscribedToVideo) {
                await prisma.videoSubscribers.upsert({
                    where: { videoId },
                    update: {
                        subscriberUserIds: { push: user.id }
                    },
                    create: {
                        videoId,
                        subscriberUserIds: [user.id]
                    }
                });
                console.log('Subscriber added/updated for video:', videoId);
            }
        }

        return {
            channelId,
            subscriberUserIds: [user.id]  // Return updated subscriberUserIds array
        };
    } catch (error) {
        console.error('Error in updateSubs:', error);
        throw new Error('Internal server error');
    }
};

export const updateUnsubs = async (videoId: string, channelId: string, user: { id: string }, source?: string) => {
    try {
        if (!user.id) {
            throw new Error('Invalid user ID');
        }

        // Handle channel subscriptions
        if (channelId) {
            const channelSubs = await prisma.channelSubscribers.findUnique({
                where: { channelId }
            });

            if (!channelSubs || !channelSubs.subscriberUserIds.includes(user.id)) {
                throw new Error('User is not subscribed to this channel');
            }

            const updatedChannelSubs = await prisma.channelSubscribers.update({
                where: { channelId },
                data: {
                    subscriberUserIds: { set: channelSubs.subscriberUserIds.filter(id => id !== user.id) }
                }
            });

            console.log('Subscriber removed from channel:', channelId);
        }

        // Handle video subscriptions
        if (videoId) {
            const videoSubs = await prisma.videoSubscribers.findUnique({
                where: { videoId }
            });

            if (!videoSubs || !videoSubs.subscriberUserIds.includes(user.id)) {
                throw new Error('User is not subscribed to this video');
            }

            const updatedVideoSubs = await prisma.videoSubscribers.update({
                where: { videoId },
                data: {
                    subscriberUserIds: { set: videoSubs.subscriberUserIds.filter(id => id !== user.id) }
                }
            });

            console.log('Subscriber removed from video:', videoId);
        }

        return {
            success: true,
            message: 'User unsubscribed successfully'
        };
    } catch (error) {
        console.error('Error in updateUnsubs:', error);
        throw new Error('Failed to unsubscribe user');
    }
};