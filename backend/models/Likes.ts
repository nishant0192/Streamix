import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { Likes } from '../utils/modelTypes'

Likes.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    videoId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'videos',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Likes',
    tableName: 'likes'
});

export { Likes }