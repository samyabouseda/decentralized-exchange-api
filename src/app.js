import express from 'express'
import { applyMiddleware, injectModels } from './middlewares'
import cors from 'cors'
import router from './routes'

const app = express()

applyMiddleware(app, [
	cors(),
	express.json(),
	express.urlencoded({ extended: true }),
	injectModels,
])

app.use('/', router)

export default app
