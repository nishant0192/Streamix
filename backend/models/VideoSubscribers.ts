import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { VideoSubscribers } from '../utils/modelTypes';
import { Videos } from "./Videos"

VideoSubscribers.init({
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
    subscriberUserIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
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
    modelName: 'VideoSubscribers',
    tableName: 'VideoSubscribers',
    timestamps: true,
});

export { VideoSubscribers };