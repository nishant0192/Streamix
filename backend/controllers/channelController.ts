import { Channels } from "../models/Channels";
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from "../utils/type";
import dotenv from "dotenv";
import { generateUniqueCode } from '../utils/generateUniqueCode';
dotenv.config();


export const createChannel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const existingChannel = await Channels.findOne({
            where: { userId: user.id }
        });

        if (existingChannel) {
            return res.status(400).json({ message: 'User already has a channel' });
        }

        const newChannel = await Channels.create({
            name,
            channelId: generateUniqueCode(),
            userId: user.id,
        });

        return res.status(201).json({ channel: newChannel });
    } catch (error) {
        console.error('Error in createChannel:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const editChannel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { channelId, newName } = req.body;
        const errors = validationResult(req);
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const existingChannel = await Channels.findOne({
            where: {
                userId: user.id,
                channelId: channelId
            }
        });


        if (!existingChannel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        existingChannel.name = newName;
        await existingChannel.save();

        return res.status(200).json({ message: 'Channel name has been changed', channel: existingChannel });
    } catch (error) {
        console.error('Error in createChannel:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteChannel = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { channelId, name } = req.body;
        const errors = validationResult(req);
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const existingChannel = await Channels.findOne({
            where: {
                userId: user.id,
                channelId: channelId
            }
        });


        if (!existingChannel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        await existingChannel.destroy();

        return res.status(200).json({ message: 'Channel has been deleted', channel: existingChannel });
    } catch (error) {
        console.error('Error in createChannel:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

