import {
	CREATED,
	INTERNAL_SERVER_ERROR,
	OK,
} from 'http-status-codes'

const create = async (req, res) => {
	try {
		const user = await req.context.models.User.create({
			username: req.body.username,
		})
		return res.status(CREATED).json({
			user,
		})
	} catch (error) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

const getAll = async (req, res) => {
	try {
		const users = await req.context.models.User.find()
		return res.status(OK).json({
			users,
		})
	} catch (error) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

export default {
	create,
	getAll,
}
