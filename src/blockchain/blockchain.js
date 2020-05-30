import Web3 from 'web3'
import config from '../../config'
import { Transaction } from 'ethereumjs-tx'

class BlockchainInterface {
	constructor() {
		this._provider = new Web3.providers.WebsocketProvider(
			config.blockchain.BLOCKCHAIN_URL,
		)
		this._web3 = new Web3(this._provider)
		this.buildTransactionObject = this.buildTransactionObject.bind(
			this,
		)
	}

	/**
	 * Tests the blockchain connection.
	 *
	 * return {boolean} true if the blockchain is connected.
	 */
	async isConnected() {
		const account = await this._web3.eth.accounts.create()
		const address = account.address
		const balance = await this._web3.eth.getBalance(address)
		return balance === '0'
	}

	/**
	 * Creates a new account on the blockchain.
	 *
	 * @see {https://web3js.readthedocs.io/en/v1.2.0/web3-eth-accounts.html#create} for further information.
	 * @return {Promise<Account>}
	 */
	async createAccount() {
		return this._web3.eth.accounts.create()
	}

	async getAddressFrom(privateKey) {
		return this._web3.eth.accounts.privateKeyToAccount(privateKey)
			.address
	}

	async buyFiat(amount, privateKey, fiat) {
		/*
		 * Note: The fiat token can be retrieved from the crowdsale.
		 */
		const { address, abi, symbol, name } = fiat
		const buyerAddress = await this.getAddressFrom(privateKey)
		const crowdsaleAddress = address
		const from = {
			address: buyerAddress,
			privateKey: privateKey.substr(2),
		}
		const to = crowdsaleAddress
		// amount is received in usdx
		const value = this._web3.utils.toHex(
			this._web3.utils.toWei(
				(amount / 231).toString(), // 231 is the fixed rate
				'ether',
			),
		)
		const contract = await new this._web3.eth.Contract(
			abi,
			address,
		)
		const token = await contract.methods.token().call()

		const res = await this.sendTransaction(
			from,
			to,
			value,
			'',
			this._web3,
		)
		if (res) {
			return {
				buyer: buyerAddress,
				fiat: {
					symbol: symbol,
					name: name,
					address: token,
				},
				amount: amount,
			}
		} else {
			throw Error(
				'Could not purchase fiat. Please try again...',
			)
		}
	}

	async deposit(amount, privateKey, token, dex) {
		const { address } = token
		const depositor = await this.getAddressFrom(privateKey)
		const dexAddress = dex.address
		const from = {
			address: depositor,
			privateKey: privateKey.substr(2),
		}
		const to = dexAddress
		const value = ''

		// Build deposit object.
		const jsonInterface = {
			name: 'deposit',
			type: 'function',
			inputs: [
				{
					type: 'address',
					name: 'token',
				},
				{
					type: 'uint',
					name: 'amount',
				},
				{
					type: 'uint',
					name: 'rate',
				},
			],
		}

		const deposit = amount // * 1000000000000000000
		const rate = 1
		const params = [address, deposit.toString(), rate]
		const data = this._web3.eth.abi.encodeFunctionCall(
			jsonInterface,
			params,
		)
		try {
			// TODO: Temporarily deactivated sending deposit...
			await this._sendTransaction(
				from,
				to,
				value,
				data,
				this._web3,
			)
			return {
				account: from.address,
				asset: {
					symbol: token.symbol,
					name: token.name,
					address: token.address,
				},
				amount: amount,
			}
		} catch (error) {
			throw Error('Deposit failed.')
		}
	}

	async sendTransaction(from, to, value, data, web3) {
		// Build transaction object.
		const txObject = await this.buildTransactionObject(
			from,
			to,
			value,
			data,
			web3,
		)
		// Sign transaction object.
		const tx = await this.signTransaction(
			txObject,
			from.privateKey,
		)
		// Broadcast the transaction.
		return await this.sendSignedTransaction(tx)
	}

	async _sendTransaction(from, to, value, data, web3) {
		const that = this
		return new Promise(async function(resolve, reject) {
			try {
				// Build transaction object.
				const txObject = await that.buildTransactionObject(
					from,
					to,
					value,
					data,
					web3,
				)
				// Sign transaction object.
				const tx = await that.signTransaction(
					txObject,
					from.privateKey,
				)
				// Broadcast the transaction.
				await that.sendSignedTransaction(tx)
				resolve({
					status: 'sent',
					transaction: tx,
				})
			} catch (error) {
				reject(error)
			}
		})
	}

	async buildTransactionObject(from, to, value, data, web3) {
		return new Promise(async function(resolve, reject) {
			let txObject
			try {
				const txCount = await web3.eth.getTransactionCount(
					from.address,
				)
				txObject = {
					nonce: web3.utils.toHex(txCount),
					to: to,
					data: web3.utils.toHex(data),
					value: web3.utils.toHex(value),
					gasLimit: web3.utils.toHex(210000),
					gasPrice: web3.utils.toHex(
						web3.utils.toWei('10', 'gwei'),
					),
				}
				resolve(txObject)
			} catch (error) {
				reject(error)
			}
		})
	}

	async signTransaction(txData, privateKey) {
		const bufferedPk = Buffer.from(privateKey, 'hex')
		let tx
		try {
			tx = new Transaction(txData)
			tx.sign(bufferedPk)
		} catch (error) {
			throw Error('Transaction signing failed.')
		}
		const serializedTx = tx.serialize()
		return '0x' + serializedTx.toString('hex')
	}

	async sendSignedTransaction(tx) {
		try {
			let res = await this._web3.eth.sendSignedTransaction(
				tx,
				(err, txHash) => {
					console.log(tx)
					if (err) console.log(err)
				},
			)
			return true
		} catch (error) {
			throw Error('Sending signed transaction failed.')
		}
	}
}

export default BlockchainInterface
