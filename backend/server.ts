// server.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import { sequelize } from './config/db';
import videoRoutes from './routes/videoRoutes';
import streamRoutes from './routes/streamRoutes';
import channelRoutes from './routes/channelRoutes';
import authRoutes from './routes/authRoutes';
import likeRoutes from './routes/likeRoutes';
import dislikeRoutes from './routes/dislikeRoutes';
import subscribersRoutes from './routes/subscribersRoutes';
import shareRoutes from './routes/shareRoutes';
import commentRoutes from './routes/commentRoutes';
import verifyAccessToken from './middlewares/verifyAccessToken';

const app = express();
const PORT = process.env.PORT || 3001;
const recordingsDir = path.join(__dirname, 'recordings');

app.use('/recordings', express.static(recordingsDir));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser middleware
app.use(express.static(path.join(__dirname, '../videos')));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use('/api/auth', authRoutes);

// Apply access token verification middleware to protected routes
app.use('/api/videos', verifyAccessToken, videoRoutes);
app.use('/api/stream', verifyAccessToken, streamRoutes);
app.use('/api/channel', verifyAccessToken, channelRoutes);
app.use('/api/stats', verifyAccessToken, likeRoutes, dislikeRoutes);
app.use('/api/stats', verifyAccessToken, subscribersRoutes);
app.use('/api/stats', verifyAccessToken, shareRoutes);
app.use('/api/stats', verifyAccessToken, commentRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
