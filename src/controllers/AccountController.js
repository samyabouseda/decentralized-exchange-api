import {
	CREATED,
	INTERNAL_SERVER_ERROR,
	OK,
} from 'http-status-codes'

const create = async (req, res) => {
	// const username = req.body.username
	// const password = req.body.password
	// TODO: Generate blockchain account with Web3.js
	// const account = await BlockchainInterface.accounts.create(password)
	// const { address, privateKey } = account
	try {
		const user = await req.context.models.User.create({
			username: req.body.username,
		})
		// const { id, username, address } = newUser
		// const user = { id, username, } // address, privateKey }
		return res.status(CREATED).json(user)
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
