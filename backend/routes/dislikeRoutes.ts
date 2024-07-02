import { Router } from 'express';
import { dislike } from '../controllers/dislikeController';
import authMiddleware from '../middlewares/authMiddleware';
import { getVideoStats } from "../controllers/getStats"
import { body } from 'express-validator';

const router = Router();

router.get('/dislike', getVideoStats);
router.post('/dislike', dislike);
// router.put('/unlike', unlike);

export default router;