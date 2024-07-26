// routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, changePassword, logoutUser } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const router = Router();

const validateChangePassword = [
    body('currentPassword').not().isEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authMiddleware, logoutUser);
router.put('/changePassword', authMiddleware, validateChangePassword, changePassword);

export default router;
