import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { VideoStats } from '../utils/modelTypes';

VideoStats.init({
    videoId: {
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
    modelName: 'VideoStats',
    tableName: 'VideoStats',
    timestamps: true,
});

export { VideoStats };
