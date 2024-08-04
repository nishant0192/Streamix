import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { AuthRequest } from '../utils/type';

dotenv.config();

const prisma = new PrismaClient();

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const accessToken = req.cookies.accessToken;

        // Handle cases with no tokens
        if (!accessToken && !refreshToken) {
            if (req.originalUrl === '/api/user/status') {
                return next();
            }
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        // Verify access token
        if (accessToken) {
            const accessSecretKey = process.env.ACCESS_TOKEN_SECRET as Secret;
            try {
                const decodedAccessToken: any = jwt.verify(accessToken, accessSecretKey);
                const user = await prisma.users.findUnique({
                    where: { id: decodedAccessToken.userId },
                });

                if (user) {
                    req.user = user;
                    return next();
                } else {
                    if (req.originalUrl === '/api/user/status') {
                        return next();
                    }
                    return res.status(401).json({ message: 'User not found' });
                }
            } catch (error) {
                console.error('Error verifying access token:', error);
                return res.status(401).json({ message: 'Access token is not valid' });
            }
        }

        // Verify refresh token
        if (refreshToken) {
            const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET as Secret;
            try {
                const decodedRefreshToken: any = jwt.verify(refreshToken, refreshSecretKey);
                const user = await prisma.users.findUnique({
                    where: { id: decodedRefreshToken.userId },
                });

                if (user) {
                    req.user = user;
                    return next();
                } else {
                    return res.status(404).json({ message: 'User not found' });
                }
            } catch (error) {
                console.error('Error verifying refresh token:', error);
                return res.status(401).json({ message: 'Refresh token is not valid' });
            }
        }

        // If no token is valid
        return res.status(401).json({ message: 'Token is not valid' });
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        return res.status(401).json({ message: 'Authentication error' });
    }
};

export default authMiddleware;
