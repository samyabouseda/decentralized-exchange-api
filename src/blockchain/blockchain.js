import Web3 from 'web3'
import config from '../../config'

class BlockchainInterface {

	constructor() {
		this._provider = new Web3.providers.WebsocketProvider(
			config.blockchain.BLOCKCHAIN_URL
		)
		this._web3 = new Web3(this._provider)
	}

	async isConnected() {
		const account = await this._web3.eth.accounts.create()
		const address = account.address
		const balance = await this._web3.eth.getBalance(address)
		return balance === '0'
	}

	/**
	 * @returns {Promise<Account>}
	 * @see https://web3js.readthedocs.io/en/v1.2.0/web3-eth-accounts.html#create
	 */
	async createAccount() {
		return this._web3.eth.accounts.create()
	}

	async getAddressFrom(privateKey) {
		return this._web3.eth.accounts.privateKeyToAccount(privateKey).address
	}
}

export default BlockchainInterface