import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { ChannelStats } from '../utils/modelTypes'

ChannelStats.init({
    channelId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    views: {
        type: DataTypes.BIGINT,
        defaultValue: BigInt(0),
        allowNull: false,
    },
    likes: {
        type: DataTypes.BIGINT,
        defaultValue: BigInt(0),
        allowNull: false,
    },
    dislikes: {
        type: DataTypes.BIGINT,
        defaultValue: BigInt(0),
        allowNull: false,
    },
    shares: {
        type: DataTypes.BIGINT,
        defaultValue: BigInt(0),
        allowNull: false,
    },
    hoursWatched: {
        type: DataTypes.BIGINT,
        defaultValue: BigInt(0),
        allowNull: false,
    },
    subscribers: {
        type: DataTypes.BIGINT,
        defaultValue: BigInt(0),
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
    modelName: 'ChannelStats',
    tableName: 'ChannelStats',
    timestamps: true,
});

export { ChannelStats };