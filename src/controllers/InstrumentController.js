import {
	CONFLICT,
	CREATED,
	INTERNAL_SERVER_ERROR, NOT_FOUND,
	OK,
} from 'http-status-codes'

const create = async (req, res) => {
	try {
		const { _id: id, address, name, symbol, abi } = await req.context.models.Instrument.create( req.body )
		const instrument = { id, address, name, symbol, abi }
		return res.status(CREATED).json({ instrument })
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			return res
				.status(CONFLICT)
				.json({ error: 'Instrument already exists!' })
		}
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

export default {
	create,
}
