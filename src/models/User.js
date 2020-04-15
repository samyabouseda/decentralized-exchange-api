import { Schema, model } from 'mongoose'
import BlockchainInterface from '../blockchain'
import { balanceSchema } from './Balance'

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
	totalDeposited: {
		type: Number,
		default: 0,
	},
	balances: [],
})

userSchema.statics.findByLogin = async function(login) {
	return this.findOne({
		username: login,
	})
}

userSchema.statics.findByPrivateKey = async function(privateKey) {
	const address = await blockchain.getAddressFrom(privateKey)
	const user = await this.findOne({
		address: address,
	})
	if (user === null)
		throw new Error(
			'This private key does not match any existing user.',
		)
	return user
}

userSchema.statics.updateBalances = async function(
	privateKey,
	purchase,
) {
	let user = await this.findByPrivateKey(privateKey)
	user.balances = _updateBalances(user.balances, purchase)
	user.save()
}

userSchema.statics.updateTotalDeposited = async function(
	privateKey,
	amount,
) {
	let user = await this.findByPrivateKey(privateKey)
	user.totalDeposited = user.totalDeposited + parseFloat(amount)
	user.save()
	return user
}

const _updateBalances = (balances, purchase) => {
	let exists = false
	let updatedBalances = [...balances]
	updatedBalances = updatedBalances.map(balance => {
		if (balance.instrumentSymbol === purchase.fiat.symbol) {
			let purchaseAmount = parseFloat(purchase.amount)
			let currentAmount = parseFloat(balance.amount)
			let newAmount = purchaseAmount + currentAmount
			exists = true
			return { ...balance, amount: newAmount }
		} else {
			return balance
		}
	})
	if (!exists) {
		updatedBalances.push({
			instrumentSymbol: purchase.fiat.symbol,
			amount: purchase.amount,
		})
	}
	return updatedBalances
}

const User = model('User', userSchema)

export default User
