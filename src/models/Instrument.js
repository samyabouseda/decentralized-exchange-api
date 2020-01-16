import { Schema, model } from 'mongoose'

const instrumentSchema = new Schema({
	address: {
		type: String,
		unique: true,
		required: true,
	},
	name: {
		type: String,
		unique: true,
		required: true,
	},
	symbol: {
		type: String,
		unique: true,
		required: true,
	},
	abi: {
		type: Object,
		unique: true,
		required: true,
	},
})

const Instrument = model('Instrument', instrumentSchema)

export default Instrument
