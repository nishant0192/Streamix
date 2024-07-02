import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { Users } from '../models/Users';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AuthRequest } from '../utils/type';

dotenv.config();

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        cookieParser()(req, res, () => { });
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }
        const secretKey = process.env.SECRET_KEY as Secret;
        const decoded: any = jwt.verify(token, secretKey);
        const user = await Users.findByPk(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authMiddleware;
