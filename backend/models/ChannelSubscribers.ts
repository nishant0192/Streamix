import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';
import { ChannelSubscribers } from '../utils/modelTypes'
import { Channels } from "./Channels"

ChannelSubscribers.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    channelId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Channels,
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
    modelName: 'ChannelSubscribers',
    tableName: 'ChannelSubscribers',
    timestamps: true,
});

export { ChannelSubscribers };