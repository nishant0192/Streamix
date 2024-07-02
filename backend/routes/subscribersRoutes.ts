import { Router } from 'express';
import { subscribers } from '../controllers/subscribeController';
import authMiddleware from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const router = Router();

router.post('/subscribe', 
    authMiddleware, 
    body('videoId').notEmpty(),
    body('channelId').notEmpty(),
    body('action').isIn(['subscribe', 'unsubscribe']),
    subscribers
);

export default router;
