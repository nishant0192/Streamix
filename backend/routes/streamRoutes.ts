import express, { Router } from "express";
import { startStream, stopStream } from "../controllers/streamController";

const router: Router = express.Router();

router.post('/startStream', startStream);
router.post('/stopStream', stopStream);

export default router;
