import { Schema, model } from 'mongoose'
import BlockchainInterface from '../blockchain'

const blockchain = new BlockchainInterface()

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	address: {
		type: String,
	},
	balances: []
})

userSchema.statics.findByLogin = async function(login) {
	return this.findOne({
		username: login,
	})
}

userSchema.statics.findByPrivateKey = async function(privateKey) {
	const address = await blockchain.getAddressFrom(privateKey)
	const user = await this.findOne({
		address: address
	})
	if (user === null) throw new Error('This private key does not match any existing user.')
	return user
	// {
	// 	id: user._id,
	// 	username: user.username,
	// 	address: user.address,
	// 	balances: user.balances,
	// }
}

const User = model('User', userSchema)

export default User
