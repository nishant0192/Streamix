import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { sequelize } from './config/db';
import videoRoutes from './routes/videoRoutes';
import streamRoutes from './routes/streamRoutes';
import channelRoutes from './routes/channelRoutes';
import authRoutes from './routes/authRoutes';
import likeRoutes from './routes/likeRoutes';
import dislikeRoutes from './routes/dislikeRoutes';
import authMiddleware from './middlewares/authMiddleware';
import subscribersRoutes from './routes/subscribersRoutes';
import shareRoutes from './routes/shareRoutes';
import commentRoutes from './routes/commentRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../videos')));
app.use(cors());
app.use('/api/auth', authRoutes);
app.use(authMiddleware);

app.use('/api/videos', videoRoutes);
app.use('/api/stream', streamRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/stats', likeRoutes, dislikeRoutes);
app.use('/api/stats', subscribersRoutes);
app.use('/api/stats', shareRoutes);
app.use('/api/stats', commentRoutes);

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
