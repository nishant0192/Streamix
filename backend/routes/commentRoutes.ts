import { Router } from 'express';
import { getComments, addComment, deleteComment } from '../controllers/commentController';
import authMiddleware from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const router = Router();

router.get('/comment', getComments);
router.post('/comment', addComment);
router.delete('/comment', deleteComment);

export default router;
