

import { Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { Users } from '../models/Users';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AuthRequest } from '../utils/type';

dotenv.config();

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
            const decodedAccessToken: any = jwt.verify(accessToken, secretKey);
            req.user = await Users.findByPk(decodedAccessToken.userId);
            return next();
        }
        if (refreshToken) {
            const secretKey = process.env.REFRESH_TOKEN_SECRET as Secret;
            const decodedRefreshToken: any = jwt.verify(refreshToken, secretKey);
            const user = await Users.findByPk(decodedRefreshToken.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = user;
            return next();
        }
        return res.status(401).json({ message: 'Token is not valid' });

    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authMiddleware;
