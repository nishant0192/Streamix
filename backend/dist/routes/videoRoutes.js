"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const videoController_1 = require("../controllers/videoController");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./recordings/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer_1.default({ storage: storage });
router.post("/record", upload.single("video"), videoController_1.recordVideos);
const recordingsDir = path_1.default.join(__dirname, "..", "recordings");
router.get("/videos", videoController_1.fetchVideos);
router.get("/videosInfo", videoController_1.videosInfo);
router.use("/recordings", express_1.default.static(recordingsDir));
exports.default = router;
