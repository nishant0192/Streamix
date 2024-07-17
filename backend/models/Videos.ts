import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { Videos } from '../utils/modelTypes';
import { Channels } from "./Channels"

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
        references: {
            model: Channels,
            key: 'channelId',
        },
        onDelete: 'CASCADE',
    },
    videoPrivacy: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'public',
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
    modelName: 'Videos',
    tableName: 'Videos',
    timestamps: true,
});

export { Videos };