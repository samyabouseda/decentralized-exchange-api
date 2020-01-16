/**
 * Test for the connection to the Ethereum blockchain.
 */

import BlockchainInterface from './index'
const blockchain = new BlockchainInterface()

describe('Blockchain', () => {
	it('is connected', async () => {
		expect(await blockchain.isConnected()).toBeTruthy()
	})
})