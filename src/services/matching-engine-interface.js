import axios from 'axios'
import config from '../../config'
import { CONFLICT } from 'http-status-codes'

class MatchingEngineInterface {
	constructor() {
		this.URI = `${config.services.MATCHING_ENGINE_URL}`
	}

	/**
	 * Register a new instrument on the matching engine service.
	 *
	 * To register a new instrument the matching engine simply instantiate
	 * a new OrderBook and stores it in the orderBooks dictionary.
	 * The key is the instrument's ID.
	 *
	 * @return {Promise<Instrument>}
	 */
	async registerNewInstrument(instrument) {
		const url = `${this.URI}/instruments/`
		try {
			return await axios.post(url, { instrument })
		} catch (error) {
			if (error.message.includes(CONFLICT)) {
				throw Error(
					'Instrument already exists on Matching Engine service',
				)
			}
			throw Error(error.message)
		}
	}

	async getBidsAndAsksFor(instrument) {
		const url = `${this.URI}/instruments/${instrument.address}`
		try {
			const response = await axios.get(url)
			return response
		} catch (error) {
			if (error.message.includes(CONFLICT)) {
				throw Error(
					'Instrument does not exist on Matching Engine service',
				)
			}
			throw Error(error.message)
		}
	}

	async placeOrder(order) {
		const url = `${this.URI}/orders/`
		try {
			return await axios.post(url, { order })
		} catch (error) {
			if (error.message.includes(CONFLICT)) {
				throw Error(
					"Order couldn't be placed on Matching Engine service",
				)
			}
			throw Error(error.message)
		}
	}
}

export default MatchingEngineInterface
