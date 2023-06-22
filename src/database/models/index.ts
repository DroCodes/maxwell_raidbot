import { Sequelize } from 'sequelize';
import 'dotenv/config'

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const  sequelize = config.url
    ? new Sequelize(config.url, config)
    : new Sequelize(config.development);

export { Sequelize, sequelize };