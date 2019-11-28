import { connectMongoDb } from './mongo'
// import { connectSomeDb } from './someDb'

const connectDb = () => {
	// handle database connection driver here.
	return connectMongoDb
}

export default connectDb()
