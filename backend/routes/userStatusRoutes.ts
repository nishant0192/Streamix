import express, { Router } from 'express';
import { status } from '../controllers/userStatusController';
import authMiddleware from '../middlewares/authMiddleware';

const router: Router = express.Router();
router.post('/status', authMiddleware, status);

export default router;
