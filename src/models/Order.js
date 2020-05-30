import { Schema, model } from 'mongoose'

const schema = new Schema({
	side: {
		type: String,
		required: true,
	},
	limitPrice: {
		type: String,
		required: true,
	},
	size: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		default: 'pending',
	},
	entryTime: {
		type: Date,
		default: Date.now,
	},
	instrument: {
		type: String,
		required: true,
	},
})

const Order = model('Order', schema)

export default Order
