"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoMetadata = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class VideoMetadata extends sequelize_1.Model {
}
exports.VideoMetadata = VideoMetadata;
VideoMetadata.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    video_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    views: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    likes: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    dislikes: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'VideoMetadata',
    tableName: 'video_metadata',
    timestamps: true,
});
