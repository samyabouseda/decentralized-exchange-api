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
})
