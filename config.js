require('dotenv').config()

const env = process.env.NODE_ENV // 'development', 'test' or 'production'

const DEFAULT_WEB_PORT = 8000
const DEFAULT_DB_PORT = 27017

const base = {
	app: {
		PORT: parseInt(process.env.PORT) || DEFAULT_WEB_PORT
	},
	db: {
		PORT: parseInt(process.env.DB_PORT) || DEFAULT_DB_PORT,
		DATABASE_URL: process.env.DATABASE_URL,
		ERASE_DB_ON_SYNC: false
	},
	blockchain: {
		BLOCKCHAIN_URL: process.env.BLOCKCHAIN_URL || 'ws://127.0.0.1:7545',
	}

}

const development = {
	configId: 'development',
	db: {
		ERASE_DB_ON_SYNC: true,
		PORT: base.db.PORT,
		DATABASE_URL: base.db.DATABASE_URL,
	}
}

const test = {
	configId: 'test',
	app: {
		port: parseInt(process.env.TEST_APP_PORT) || DEFAULT_WEB_PORT
	},
	db: {
		ERASE_DB_ON_SYNC: true,
		PORT: base.db.PORT,
		DATABASE_URL: base.db.DATABASE_URL,
	},
}

const production = {
	configId: 'production',
	app: {
		PORT: parseInt(process.env.PORT)
	},
	db: {
		PORT: process.env.DB_PORT,
		DATABASE_URL: process.env.MONGODB_URI || process.env.DATABASE_URL,
		ERASE_ON_DB_SYNC: false,
	},
}

const config = {
	development,
	test,
	production
}

module.exports = { ...base, ...config[env] }