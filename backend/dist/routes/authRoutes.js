"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const express_validator_1 = require("express-validator");
const router = express_1.Router();
const validateChangePassword = [
    express_validator_1.body('currentPassword').not().isEmpty().withMessage('Current password is required'),
    express_validator_1.body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.put('/change-password', authMiddleware_1.default, validateChangePassword, authController_1.changePassword);
exports.default = router;
