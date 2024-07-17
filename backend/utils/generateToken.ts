// utils/generateToken.ts
import jwt, { Secret } from 'jsonwebtoken';

const generateAccessToken = (userId: number): string => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET as Secret;
    return jwt.sign({ userId }, secretKey, { expiresIn: '7d' });
};

const generateRefreshToken = (userId: number): string => {
    const secretKey = process.env.REFRESH_TOKEN_SECRET as Secret;
    return jwt.sign({ userId }, secretKey, { expiresIn: '7d' });
};

export { generateAccessToken, generateRefreshToken };
