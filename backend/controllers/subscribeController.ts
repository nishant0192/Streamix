import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { updateSubs, updateUnsubs } from './updateStats';
import { AuthRequest } from "../utils/type";

export const subscribers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { videoId, channelId, action, source } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        let channelSubs;
        if (action === 'subscribe') {
            channelSubs = await updateSubs(videoId, channelId, user, source);
        } else if (action === 'unsubscribe') {
            channelSubs = await updateUnsubs(videoId, channelId, user, source);
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        return res.status(200).json(channelSubs);
    } catch (error) {
        console.error('Error in subscribers:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
