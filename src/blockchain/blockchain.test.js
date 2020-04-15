/**
 * Test for the connection to the Ethereum blockchain.
 */

import BlockchainInterface from './index'
const blockchain = new BlockchainInterface()

describe('Blockchain', () => {
	it('is connected', async () => {
		expect(await blockchain.isConnected()).toBeTruthy()
	})

	it('creates an account', async () => {
		expect(true).toBe(false)
	})

	it('let user purchase fiat currency', async () => {
		// set account 0 from ganache

		// get the fiat document from mongodb

		// purchase fiat
		expect(true).toBe(false)
	})

	it('let user deposit fiat currency', async () => {
		const amount = 100
		const privateKey =
			'd872773fefeabf8f9a70e6b466b4ecb1bacfe38c958150f233a1d7702b0e5931' // account 6 on ganache
		const token = {
			address: '0x7d0c42B08088B9c451dd68b3a6e3Ed770c6E08D6',
		}
		const dex = {
			address: '0x22CFCb0beBc948C0992C6eA29A0258312e784B52',
		}
		const deposit = await blockchain.deposit(
			amount,
			privateKey,
			token,
			dex,
		)
		console.log(deposit)
		expect(true).toBe(false)
	})
})
