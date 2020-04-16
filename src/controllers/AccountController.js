import {
	CONFLICT,
	CREATED,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND,
	OK,
} from 'http-status-codes'
import BlockchainInterface from '../blockchain'

const create = async (req, res) => {
	try {
		console.log(req.body)
		const user = await req.context.models.User.create({
			username: req.body.username,
			balances: [],
		})
		console.log(user)
		try {
			const account = await new BlockchainInterface().createAccount()
			const userResponse = {
				id: user.id,
				username: user.username,
				address: account.address,
				privateKey: account.privateKey,
				totalDeposited: user.totalDeposited,
			}
			user.address = account.address
			user.save()
			return res.status(CREATED).json({ user: userResponse })
		} catch (error) {
			return res
				.status(INTERNAL_SERVER_ERROR)
				.json({ error: error.message })
		}
	} catch (error) {
		console.log(error)
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

const login = async (req, res) => {
	try {
		let user = await req.context.models.User.findByPrivateKey(
			req.params.privateKey,
		)
		const {
			_id,
			username,
			address,
			balances,
			totalDeposited,
		} = user
		return res.status(OK).json({
			user: {
				id: _id,
				username,
				address,
				balances,
				totalDeposited,
			},
		})
	} catch (error) {
		if (
			error.message ===
			'This private key does not match any existing user.'
		) {
			return res
				.status(NOT_FOUND)
				.json({ error: error.message })
		}
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

export default {
	create,
	getAll,
	login,
}
