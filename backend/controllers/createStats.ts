import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const createVideoStats = async (videoId: string) => {
    try {
        const existingVideoStats = await prisma.videoStats.findUnique({
            where: { videoId },
        });

        if (!existingVideoStats) {
            await prisma.videoStats.create({
                data: {
                    videoId,
                    likes: BigInt(0),
                },
            });
        }
    } catch (error) {
        console.error('Error in createVideoStats:', error);
        throw new Error('Internal server error');
    } finally {
        await prisma.$disconnect();
    }
};
