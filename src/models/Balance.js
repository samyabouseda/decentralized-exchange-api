import { Schema, model } from 'mongoose'

export const balanceSchema = new Schema({
	instrumentSymbol: {
		type: String,
		unique: true,
		required: true,
	},
	amount: {
		type: Number,
		unique: true,
		required: true,
	},
})

const Balance = model('Balance', balanceSchema)

export default Balance
