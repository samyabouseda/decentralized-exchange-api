import { injectModels } from './injectModels'

export const applyMiddleware = (app, middlewares = []) =>
	middlewares.forEach(middleware => app.use(middleware))

export { injectModels }
