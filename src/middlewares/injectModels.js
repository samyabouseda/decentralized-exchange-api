import models from '../models'

export const injectModels = async (req, res, next) => {
	req.context = {
		models,
	}
	next()
}
