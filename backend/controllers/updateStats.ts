import { VideoStats } from "../models/VideoStats";
import dotenv from "dotenv";
import { ChannelSubscribers } from "../models/ChannelSubscribers";
import { VideoSubscribers } from "../models/VideoSubscribers";
dotenv.config();

export const updateLike = async (videoId: string) => {
    try {
        let video = await VideoStats.findOne({
            where: {
                videoId
            }
        });

        if (!video) {
            video = await VideoStats.create({
                videoId,
                likes: BigInt(1),
                dislikes: BigInt(0)
            });
            console.log('New video stats created:', video);
        } else {
            video.likes = video.likes ? BigInt(video.likes) + BigInt(1) : BigInt(1);
            await video.save();
        }

        return {
            ...video.toJSON(),
            likes: video.likes.toString(),
            dislikes: video.dislikes.toString()
        };
    } catch (error) {
        console.error('Error in updateLike:', error);
        throw new Error('Internal server error');
    }
};

export const updateunLike = async (videoId: string) => {
    try {
        let video = await VideoStats.findOne({
            where: {
                videoId
            }
        });

        if (video) {
            video.likes = video.likes ? BigInt(video.likes) - BigInt(1) : BigInt(0);
            await video.save();
            console.log('Video stats updated:', video);
        }

        return video
            ? { ...video.toJSON(), likes: video.likes.toString(), dislikes: video.dislikes.toString() }
            : { videoId, likes: "0", dislikes: "0" };
    } catch (error) {
        console.error('Error in updateunLike:', error);
        throw new Error('Internal server error');
    }
};

export const updateDislike = async (videoId: string) => {
    try {
        let video = await VideoStats.findOne({
            where: {
                videoId
            }
        });

        if (!video) {
            video = await VideoStats.create({
                videoId,
                likes: BigInt(0),
                dislikes: BigInt(1)
            });
            console.log('New video stats created:', video);
        } else {
            video.dislikes = video.dislikes ? BigInt(video.dislikes) + BigInt(1) : BigInt(1);
            await video.save();
        }

        return {
            ...video.toJSON(),
            likes: video.likes.toString(),
            dislikes: video.dislikes.toString()
        };
    } catch (error) {
        console.error('Error in updateDislike:', error);
        throw new Error('Internal server error');
    }
};

export const updateunDislike = async (videoId: string) => {
    try {
        let video = await VideoStats.findOne({
            where: {
                videoId
            }
        });

        if (video) {
            video.dislikes = video.dislikes ? BigInt(video.dislikes) - BigInt(1) : BigInt(0);
            await video.save();
            console.log('Video stats updated:', video);
        }

        return video
            ? { ...video.toJSON(), likes: video.likes.toString(), dislikes: video.dislikes.toString() }
            : { videoId, likes: "0", dislikes: "0" };
    } catch (error) {
        console.error('Error in updateunDislike:', error);
        throw new Error('Internal server error');
    }
};


export const updateSubs = async (videoId: string, channelId: string, user: { id: string }, source?: string) => {
    try {
        let channelSubs = await ChannelSubscribers.findOne({
            where: {
                channelId,
            }
        });

        if (channelSubs) {

            if (!channelSubs.subscriberUserIds.includes(user.id)) {
                channelSubs.subscriberUserIds = [...channelSubs.subscriberUserIds, user.id];
                await channelSubs.save();
                console.log('Subscribers updated:', channelSubs);
            }
        } else {

            channelSubs = await ChannelSubscribers.create({
                channelId,
                subscriberUserIds: [user.id]
            });
            console.log('Subscriber added:', channelSubs);
        }
        console.log("source", source)
        if (source == 'videoId') {
            let videoSubs = await VideoSubscribers.findOne({
                where: {
                    videoId,
                }
            });
            console.log("videoSubs", videoSubs)
            if (videoSubs) {

                if (!videoSubs.subscriberUserIds.includes(user.id)) {
                    videoSubs.subscriberUserIds = [...videoSubs.subscriberUserIds, user.id];
                    await videoSubs.save();
                    console.log('Video subscribers updated:', videoSubs);
                }
            } else {

                videoSubs = await VideoSubscribers.create({
                    videoId,
                    subscriberUserIds: [user.id]
                });
                console.log('Video subscriber added:', videoSubs);
            }
        }

        return channelSubs
            ? { ...channelSubs.toJSON(), subscriberUserIds: channelSubs.subscriberUserIds }
            : { videoId, subscriberUserIds: [] };
    } catch (error) {
        console.error('Error in updateSubs:', error);
        throw new Error('Internal server error');
    }
};

export const updateUnsubs = async (videoId: string, channelId: string, user: { id: string }, source?: string) => {
    try {
        let channelSubs = await ChannelSubscribers.findOne({
            where: {
                channelId,
            }
        });

        if (channelSubs) {

            channelSubs.subscriberUserIds = channelSubs.subscriberUserIds.filter((subscriberId: string) => subscriberId !== user.id);


            if (channelSubs.subscriberUserIds.length === 0) {
                await channelSubs.destroy();
                console.log('All subscribers removed:', channelSubs);
            } else {
                await channelSubs.save();
                console.log('Subscriber removed:', channelSubs);
            }
        }

        // if (source === 'videoId') {
            let videoSubs = await VideoSubscribers.findOne({
                where: {
                    videoId,
                }
            });

            if (videoSubs) {

                videoSubs.subscriberUserIds = videoSubs.subscriberUserIds.filter((subscriberId: string) => subscriberId !== user.id);


                if (videoSubs.subscriberUserIds.length === 0) {
                    await videoSubs.destroy();
                    console.log('All video subscribers removed:', videoSubs);
                } else {
                    await videoSubs.save();
                    console.log('Video subscriber removed:', videoSubs);
                }
            }
        // }

        return channelSubs
            ? { ...channelSubs.toJSON(), subscriberUserIds: channelSubs.subscriberUserIds }
            : { videoId, subscriberUserIds: [] };
    } catch (error) {
        console.error('Error in updateUnsubs:', error);
        throw new Error('Internal server error');
    }
};
