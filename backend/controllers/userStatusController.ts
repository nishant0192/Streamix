import { Request, Response } from 'express';
import { AuthRequest } from '../utils/type';
import { prisma } from '../config/db';

const handleError = (res: Response, statusCode: number, message: string) => {

    if (statusCode >= 500) {
        console.error(message);
    }
    return res.status(statusCode).json({ message });
};

export const status = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(200).json({ message: 'User is logged out' });
        }
        
        const user = req.user;
        if (user && user.id) {
            let userStatus = await prisma.userStatus.findUnique({
                where: { userId: user.id },
            });

            if (!userStatus) {
                userStatus = await prisma.userStatus.create({
                    data: {
                        userId: user.id,
                        status: 'loggedOut',
                    },
                });
            }
            
            let message;
            if (userStatus.status === 'loggedIn') {
                message = 'User is logged in';
            } else if (userStatus.status === 'loggedOut') {
                message = 'User is logged out';
            } else {
                message = 'User status unknown';
            }

            return res.status(200).json({
                message,
                userId: user.id,
                lastLoginAt: userStatus.lastLoginAt,
            });
        } else {
            return res.status(401).json({ message: 'User not authenticated' });
        }
    } catch (error) {
        return handleError(res, 500, 'Internal server error');
    }
};
