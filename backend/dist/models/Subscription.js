"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Subscription extends sequelize_1.Model {
}
exports.Subscription = Subscription;
Subscription.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    channel_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.sequelize,
    modelName: 'Subscription',
    tableName: 'subscriptions',
    timestamps: true,
});
