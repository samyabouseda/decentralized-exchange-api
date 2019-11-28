import {
	CREATED,
	INTERNAL_SERVER_ERROR,
	OK,
	NO_CONTENT,
	NOT_FOUND,
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

const update = async (req, res) => {
	const { userId } = req.params
	const updatedUser = req.body
	try {
		await req.context.models.User.findByIdAndUpdate(
			userId,
			{ ...updatedUser },
			{ new: true },
			(err, user) => {
				if (err) {
					console.log(err)
					res.status(INTERNAL_SERVER_ERROR).json({
						error: error.message,
					})
				} else {
					res.status(OK).json({ user })
				}
			},
		)
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

const getById = async (req, res) => {
	try {
		const user = await req.context.models.User.findById(
			req.params.userId,
		)
		return res.status(OK).json({ user })
	} catch (error) {
		return res.status(NOT_FOUND).json({ error: error.message })
	}
}

const remove = async (req, res) => {
	try {
		const user = await req.context.models.User.findByIdAndDelete(
			req.params.userId,
		)
		return res.status(NO_CONTENT).json({
			success: `User with id ${user.id} deleted successfully!`,
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
	getById,
	update,
	remove,
}
