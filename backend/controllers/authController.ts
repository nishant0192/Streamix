// controllers/authController.ts

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { Users } from '../models/Users';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import { AuthRequest } from '../utils/type';

// Error handler function
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

        let existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        existingUser = await Users.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            username,
            email,
            passwordHash: hashedPassword,
        });

        const accessToken = generateAccessToken(newUser.id as unknown as number);
        const refreshToken = generateRefreshToken(newUser.id as unknown as number);

        // Set cookies with SameSite=None and Secure attributes
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });


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

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user.id as unknown as number);
        const refreshToken = generateRefreshToken(user.id as unknown as number);

        // Set cookies with SameSite=None and Secure attributes
        res.cookie('refreshToken', refreshToken, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        res.cookie('accessToken', accessToken, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });


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
        user.passwordHash = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        return handleError(res, 500, 'Internal server error');
    }
};

export const status = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        res.status(200).json({ message: 'User is logged in', userId: user.id });
    } catch (error) {
        return handleError(res, 500, 'Internal server error');
    }
};
