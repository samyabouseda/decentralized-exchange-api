import Web3 from 'web3'

const provider = new Web3.providers.WebsocketProvider(
	"ws://127.0.0.1:7545"
);

const web3 = new Web3(provider)

const isConnected = async () => {
	const account = await web3.eth.accounts.create()
	const address = account.address
	const balance = await web3.eth.getBalance(address)
	return balance === '0'
	// add new promise
}

const BlockchainInterface = {
	web3, isConnected
}

export default BlockchainInterface