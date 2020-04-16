import {
	CONFLICT,
	CREATED,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND,
	OK,
} from 'http-status-codes'
import MatchingEngineInterface from '../services/matching-engine-interface'
import BlockchainInterface from '../blockchain'

/*
 * To register an instrument representing a fiat
 * currency, the crowdsale must be registered instead
 * of the token itself.
 *
 * Note: The fiat token can be retrieved from the crowdsale.
 */
const create = async (req, res) => {
	try {
		const {
			_id: id,
			address,
			name,
			symbol,
			abi,
		} = await req.context.models.Instrument.create(req.body)
		const instrument = { id, address, name, symbol, abi }
		try {
			const response = await new MatchingEngineInterface().registerNewInstrument(
				instrument,
			)
			return res.status(CREATED).json({ instrument })
		} catch (error) {
			console.log(
				'Could not register the instrument on the matching engine service.',
			)
		}
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			console.log(error)
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

const getById = async (req, res) => {
	try {
		const _instrument = await req.context.models.Instrument.findById(
			req.params.instrumentId,
		)
		const instrument = await new MatchingEngineInterface().getBidsAndAsksFor(
			_instrument,
		)
		return res.status(OK).json({
			instrument,
		})
	} catch (error) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

const purchaseFiat = async (req, res) => {
	try {
		const { privateKey, amount } = req.body
		const fiat = await req.context.models.Instrument.findOne({
			symbol: req.params.instrumentSymbol,
		})
		let purchase
		let user
		try {
			purchase = await new BlockchainInterface().buyFiat(
				amount,
				privateKey,
				fiat,
			)
			user = await req.context.models.User.updateBalances(
				privateKey,
				purchase,
			)
		} catch (error) {}

		return res.status(OK).json({
			purchase,
			user,
		})
	} catch (error) {
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

const depositFiat = async (req, res) => {
	try {
		const { privateKey, amount } = req.body
		let user = await req.context.models.User.findByPrivateKey(
			privateKey,
		)
		if (!(await userHasEnoughFunds(amount))) {
			throw Error(
				"User doesn't have enough fund to make this deposit.",
			)
		}
		const fiat = await req.context.models.Instrument.findOne({
			symbol: req.params.instrumentSymbol,
		})
		const dex = await req.context.models.Instrument.findOne({
			symbol: 'DEX',
		})

		let deposit = await new BlockchainInterface().deposit(
			amount,
			privateKey,
			fiat,
			dex,
		)
		user = await req.context.models.User.updateTotalDeposited(
			privateKey,
			amount,
		)
		return res.status(OK).json({
			totalDeposited: user.totalDeposited,
			deposit,
		})
	} catch (error) {
		console.log(error.message)
		return res
			.status(INTERNAL_SERVER_ERROR)
			.json({ error: error.message })
	}
}

const userHasEnoughFunds = (user, amount) => {
	return true
}

export default {
	create,
	getAll,
	getById,
	purchaseFiat,
	depositFiat,
}
