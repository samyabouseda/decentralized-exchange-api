import {
	CONFLICT,
	CREATED,
	INTERNAL_SERVER_ERROR,
	NOT_FOUND,
	OK,
} from 'http-status-codes'
import MatchingEngineInterface from '../services/matching-engine-interface'
import BlockchainInterface from '../blockchain'

const placeOrder = async (req, res) => {
	try {
		const newOrder = await req.context.models.Order.create(
			req.body.order,
		)
		try {
			// 1. Check user has enough funds
			// 2. Check user has enough funds deposited  through blockchain interface
			// ?. Sign order
			// ?. Keep signed order in memory
			// 3. Update user trading history
			// 4. Place order on matching engine (ME)
			// 5. Update order status based on ME result
			// 6. Update user balance
			// 7. Build response object
			// 8. Return response object
			const response = await new MatchingEngineInterface().placeOrder(
				newOrder,
			)
			const executionResult = response.data.order

			const order = {
				id: newOrder._id,
				account: '0x3d088960898540017ABeCEcAf6017246899495e4',
				side: executionResult.side,
				instrument: newOrder.instrument,
				limitPrice: executionResult.limitPrice,
				size: executionResult.size,
				sizeRemaining: executionResult.sizeRemaining,
				status: executionResult.status,
				entryTime: executionResult.entryTime,
			}
			const user = {
				id: '0x3d088960898540017ABeCEcAf6017246899495e4',
				balances: [],
			}
			return res.status(CREATED).json({ order, user })
		} catch (error) {
			console.log(
				"The order couldn't be placed on the matching engine service.",
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

export default {
	placeOrder,
}
