import { Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AuthRequest } from '../utils/type';

dotenv.config();

const prisma = new PrismaClient();

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        cookieParser()(req, res, () => { });

        const refreshToken = req.cookies.refreshToken;
        const accessToken = req.cookies.accessToken;
        if (!refreshToken && !accessToken) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        if (accessToken) {
            const secretKey = process.env.ACCESS_TOKEN_SECRET as Secret;
            try {
                const decodedAccessToken: any = jwt.verify(accessToken, secretKey);
                // Find the user by ID from decoded token
                const user = await prisma.users.findUnique({
                    where: { id: decodedAccessToken.userId },
                });

                if (user) {
                    req.user = user;
                    return next();
                } else {
                    return res.status(401).json({ message: 'User not found' });
                }
            } catch (error) {
                console.error('Error verifying access token:', error);
                return res.status(401).json({ message: 'Access token is not valid' });
            }
        }

        // Verify refreshToken if accessToken is not present
        if (refreshToken) {
            const secretKey = process.env.REFRESH_TOKEN_SECRET as Secret;
            try {
                const decodedRefreshToken: any = jwt.verify(refreshToken, secretKey);
                // Find the user by ID from decoded token
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
                // Refresh token is invalid or expired
                console.error('Error verifying refresh token:', error);
                return res.status(401).json({ message: 'Refresh token is not valid' });
            }
        }

        return res.status(401).json({ message: 'Token is not valid' });

    } catch (error) {
        console.error('Error in authentication middleware:', error);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authMiddleware;
