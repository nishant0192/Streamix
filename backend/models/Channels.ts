import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { Channel } from '../utils/modelTypes'

Channel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    subscribers: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    hoursWatched: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    likes: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    shares: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    dislikes: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    noOfVideos: {
        type: DataTypes.BIGINT,
        allowNull:false,
        defaultValue: 0,
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
    modelName: 'Channel',
    tableName: 'channels',
    timestamps: true,
});

export { Channel };