import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { recordVideos, fetchVideos, videosInfo } from '../controllers/videoController';

const router: Router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./recordings/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

router.post('/record', upload.single('video'), recordVideos);
router.get('/videos', fetchVideos);
router.get('/videosInfo', videosInfo);

const recordingsDir: string = path.join(__dirname, '..', 'recordings');
router.use('/recordings', express.static(recordingsDir));

export default router;
