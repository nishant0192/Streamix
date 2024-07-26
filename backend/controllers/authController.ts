import { prisma } from '../config/db';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { serialize } from 'cookie';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import { AuthRequest } from '../utils/type';
import dotenv from 'dotenv';
import { clearCookie, setCookie } from '../utils/cookies';

dotenv.config();

const handleError = (res: Response, statusCode: number, message: string) => {
    console.error(message);
    return res.status(statusCode).json({ message });
};

export const registerUser = async (req: AuthRequest, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        existingUser = await prisma.users.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                passwordHash: hashedPassword,
            },
        });

        const accessToken = generateAccessToken(newUser.id as unknown as number);
        const refreshToken = generateRefreshToken(newUser.id as unknown as number);

        setCookie(res, 'refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        setCookie(res, 'accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        // Update or create user status
        await prisma.userStatus.upsert({
            where: { userId: newUser.id },
            update: {
                status: 'loggedIn',
                lastLoginAt: new Date(),
            },
            create: {
                userId: newUser.id,
                status: 'loggedIn',
                lastLoginAt: new Date(),
            },
        });

        return res.status(201).json({ accessToken, userId: newUser.id });
    } catch (error) {
        return handleError(res, 500, 'Internal server error');
    }
};

export const loginUser = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user.id as unknown as number);
        const refreshToken = generateRefreshToken(user.id as unknown as number);

        setCookie(res, 'refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        setCookie(res, 'accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        // Update user status
        await prisma.userStatus.upsert({
            where: { userId: user.id },
            update: {
                status: 'loggedIn',
                lastLoginAt: new Date(),
            },
            create: {
                userId: user.id,
                status: 'loggedIn',
                lastLoginAt: new Date(),
            },
        });

        return res.json({ accessToken, userId: user.id });
    } catch (error) {
        return handleError(res, 500, 'Internal server error');
    }
};


export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);


        await prisma.users.update({
            where: { id: user.id },
            data: { passwordHash: hashedNewPassword },
        });

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        return handleError(res, 500, 'Internal server error');
    }
};


export const logoutUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'User not logged in' });
        }

        clearCookie(res, 'accessToken', {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
        });

        clearCookie(res, 'refreshToken', {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
        });

        // Update user status
        await prisma.userStatus.update({
            where: { userId: user.id },
            data: {
                status: 'loggedOut',
            },
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

