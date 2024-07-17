import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { Likes } from '../utils/modelTypes'
import { Videos } from "./Videos"
import { Users } from "./Users"

Likes.init({
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
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
        },
        onDelete: 'CASCADE',
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
    modelName: 'Likes',
    tableName: 'Likes',
    timestamps: true,
});

export { Likes };