"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./config/db");
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const streamRoutes_1 = __importDefault(require("./routes/streamRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const app = express_1.default();
const PORT = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../videos')));
app.use(cors_1.default());
app.use('/api/auth', authRoutes_1.default);
app.use(authMiddleware_1.default);
app.use('/api/videos', videoRoutes_1.default);
app.use('/api/stream', streamRoutes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});
db_1.sequelize.authenticate()
    .then(() => {
    console.log('Database connected...');
    return db_1.sequelize.sync();
})
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Unable to connect to the database:', error);
});
