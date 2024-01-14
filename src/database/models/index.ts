import { Sequelize } from 'sequelize';
import 'dotenv/config';

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(__dirname + '/../config/config.ts')[env];

// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
//
// dotenv.config();
//
// const env = process.env.NODE_ENV || 'development';
// import config from '../config/config';

// const sequelize = config.url
// 	? new Sequelize(config.url, config)
// 	: new Sequelize(config.development);

const sequelize = config.url
	? new Sequelize(config.url, {
		...config,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	})
	: new Sequelize({
		...config.development,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	});

export { Sequelize, sequelize };