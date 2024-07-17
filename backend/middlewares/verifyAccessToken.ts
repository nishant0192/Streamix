// middlewares/verifyAccessToken.ts

import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { Users } from '../models/Users';
import { AuthRequest } from '../utils/type';

const verifyAccessToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken; // Extract token from cookies
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: 'No access token provided' });
    }

    try {
        const secretKey = process.env.ACCESS_TOKEN_SECRET as Secret;
        const decoded: any = jwt.verify(token, secretKey);

        // Verify if user exists in the database
        const user = await Users.findByPk(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Access token verification error:', error);
        return res.status(401).json({ message: 'Access token is not valid' });
    }
};

export default verifyAccessToken;
