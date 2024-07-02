import { VideoStats } from "../models/VideoStats";
import dotenv from "dotenv";
dotenv.config();

export const createVideoStats = async (videoId: string) => {
    try {
        const video = await VideoStats.findOne({
            where: { videoId }
        });

        if (!video) {
            await VideoStats.create({
                videoId,
                likes: BigInt(0),
            });
        }
    } catch (error) {
        console.error('Error in createVideoStats:', error);
        throw new Error('Internal server error');
    }
};
