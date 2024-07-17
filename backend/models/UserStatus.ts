import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { UserStatus } from '../utils/modelTypes';
import { Users } from "./Users"

UserStatus.init({
    userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
    modelName: 'UserStatus',
    tableName: 'UserStatus',
    timestamps: true,
});

export { UserStatus };