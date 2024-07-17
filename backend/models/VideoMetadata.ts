import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { VideoMetadata } from '../utils/modelTypes'
import { Videos } from "./Videos"

VideoMetadata.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    videoId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Videos,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    views: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
    },
    likes: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
    },
    dislikes: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
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
    modelName: 'VideoMetadata',
    tableName: 'VideoMetadata',
    timestamps: true,
});

export { VideoMetadata };