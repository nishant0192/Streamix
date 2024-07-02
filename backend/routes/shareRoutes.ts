import { Router } from 'express';
import { share } from '../controllers/shareController';
import authMiddleware from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const router = Router();

router.post('/share', share);

export default router;
