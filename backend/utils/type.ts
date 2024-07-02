import { Request } from 'express';
import { Channel, Comment, Like, Subscription, User, Video, VideoMetadata } from './models';

export interface AuthRequest extends Request {
    user?: User;
}

export interface ChannelRequest extends Request {
    user?: User;
}
