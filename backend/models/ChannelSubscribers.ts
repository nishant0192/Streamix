import { Model, DataTypes, BIGINT } from 'sequelize';
import { sequelize } from '../config/db';
import { ChannelSubscribers } from '../utils/modelTypes'

ChannelSubscribers.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'channels',
            key: 'channelId',
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
    modelName: 'ChannelSubscribers',
    tableName: 'ChannelSubscribers',
    timestamps: true,
});

export { ChannelSubscribers };
