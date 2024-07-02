import { Sequelize } from 'sequelize';
import dotenv from "dotenv"
dotenv.config()

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
});

export { sequelize };
