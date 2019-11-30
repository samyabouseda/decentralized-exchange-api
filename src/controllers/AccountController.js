import {
	CONFLICT,
	CREATED,
	INTERNAL_SERVER_ERROR,
	OK,
} from 'http-status-codes'
import BlockchainInterface from '../blockchain'

const create = async (req, res) => {
	try {
		const user = await req.context.models.User.create({
			username: req.body.username,
		})
		const account = await new BlockchainInterface().createAccount()
		const userResponse = {
			id: user.id,
			username: user.username,
			address: account.address,
			privateKey: account.privateKey,
		}
		return res.status(CREATED).json({ user: userResponse })
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			return res
				.status(CONFLICT)
				.json({ error: 'User already exists!' })
		}
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
