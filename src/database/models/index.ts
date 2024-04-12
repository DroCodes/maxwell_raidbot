import { Sequelize } from 'sequelize';
import 'dotenv/config';

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require(__dirname + '/../config/config.ts')[env];

// dotenv.config();
// import config from '../config/config';

const TZ = 'America/New_York';

// const sequelize = config.url
// 	? new Sequelize(config.url, { ...config, timezone: TZ })
// 	: new Sequelize({ ...config.development, timezone: TZ });

const sequelize = config.url
	? new Sequelize(config.url, {
		...config,
		dialectOptions: {
			ssl: {
				require: false,
				rejectUnauthorized: false,
			},
		},
		timezone: TZ,
	})
	: new Sequelize({
		...config.development,
		dialectOptions: {
			ssl: {
				require: false,
				rejectUnauthorized: false,
			},
		},
		timezone: TZ,
	});

export { Sequelize, sequelize };