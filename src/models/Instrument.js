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
		required: true,
	},
})

// instrumentSchema.statics.findAll = async function() {
// 	const _instruments = this.find({})
// 	return _instruments.map(instrument => ({
// 		id: instrument.id,
// 		address: instrument.address,
// 		symbol: instrument.symbol,
// 		name: instrument.name
// 	}))
// }

const Instrument = model('Instrument', instrumentSchema)

export default Instrument
