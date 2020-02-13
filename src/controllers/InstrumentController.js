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
		// TODO: new MatchingEngineInterface().registerNewInstrument(instrument)
		// to register a new instrument the matching engine simply instantiate
		// a new OrderBook and stores it in the orderBooks dictionary.
		// The key is the instrument's ID (or could be address).
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

const getAll = async (req, res) => {
	try {
		const instruments = await req.context.models.Instrument.find()
		return res.status(OK).json({
			instruments,
		})
	} catch (error) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

export default {
	create,
	getAll
}
