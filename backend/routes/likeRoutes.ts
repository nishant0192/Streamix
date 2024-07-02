import { Router } from 'express';
import { like } from '../controllers/likeController';
import authMiddleware from '../middlewares/authMiddleware';
import { getVideoStats } from "../controllers/getStats"
import { body } from 'express-validator';

const router = Router();

router.get('/like', getVideoStats);
router.post('/like', like);
// router.put('/unlike', unlike);

export default router;