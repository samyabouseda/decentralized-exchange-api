import config from '../../config'
import mongoose, { models } from 'mongoose'

import fs from 'fs'
import util from 'util'
import path from 'path'

const readDir = util.promisify(fs.readdir).bind(fs)

const {
	DATABASE_URL,
	ERASE_DB_ON_SYNC,
} = config.db

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 500,
	connectTimeoutMS: 10000,
}

const connectMongoDb = () =>
	mongoose
		.connect(DATABASE_URL, options)
		.then(async () => {
			if (ERASE_DB_ON_SYNC) { await eraseDatabase() }
			try {
				await seedDatabase()
			} catch (error) {
				console.log('Database seeding failed!')
			}
		})
		.catch(error => {
			console.log(error)
		})

const eraseDatabase = async () => {
	const iterableModels = Object.values(models)
	await Promise.all([
		iterableModels.map(async model => model.deleteMany({}))
	])
}

const seedDatabase = async (runSaveMiddleware = true) => {
	const seedsDir = path.join(__dirname, 'seeds')
	const seedFiles = await readDir(seedsDir)
	seedFiles.map(async seedFile => {
		const modelName = getModelNameFrom(seedFile)
		const model = models[modelName]
		if (!model) throw new Error(`Cannot find Model '${modelName}'`)
		const { data } = require(path.join(seedsDir, seedFile))
		runSaveMiddleware
			? await model.create(data)
			: await model.insertMany(data)
	})
}

const getModelNameFrom = fileName => fileName.split('.seed.js')[0].split('_')[1]

export { connectMongoDb }
