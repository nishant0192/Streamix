import { Router } from 'express';
import { createChannel, editChannel,deleteChannel } from '../controllers/channelController';
import authMiddleware from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const router = Router();

router.post('/createChannel', createChannel);
router.put('/editChannel', editChannel);
router.delete('/deleteChannel', deleteChannel);

export default router;