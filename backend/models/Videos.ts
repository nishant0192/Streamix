import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { Videos } from '../utils/modelTypes';

Videos.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    telegramFileId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    extension: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    videoPrivacy: {
        type: DataTypes.ENUM('public', 'private', 'unlisted'),
        defaultValue: "public",
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'Video',
    tableName: 'Videos',
    timestamps: true,
});

export { Videos };
