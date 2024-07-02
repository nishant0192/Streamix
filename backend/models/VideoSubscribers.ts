import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

class VideoSubscribers extends Model {
    subscriberUserIds: any;
}

VideoSubscribers.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    videoId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Videos',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    subscriberUserIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: []
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
