import app from '../../app'
import supertest from 'supertest'
import { setupDB } from '../../test-setup'
import { CREATED } from 'http-status-codes'

const request = supertest(app)

const INSTRUMENTS = {
	INSTRUMENT_1: {
		address: '0x776a9b10c5fe1805317B4B0da110672C53608aDd',
		name: 'DummyInstrument',
		symbol: 'DMY',
		abi: [
			{
			"type":"event",
			"inputs": [{"name":"a","type":"uint256","indexed":true},{"name":"b","type":"bytes32","indexed":false}],
			"name":"Event"
			},
			{
			"type":"event",
			"inputs": [{"name":"a","type":"uint256","indexed":true},{"name":"b","type":"bytes32","indexed":false}],
			"name":"Event2"
			},
			{
			"type":"function",
			"inputs": [{"name":"a","type":"uint256"}],
			"name":"foo",
			"outputs": []
			}
		]
	},
}

setupDB()

describe('Instruments endpoint', () => {
	it('should register a new instrument', async done => {
		const response = await request.post('/instruments').send(INSTRUMENTS.INSTRUMENT_1)
		const { status, body } = response
		expect(status).toEqual(CREATED)
		expect(body).toHaveProperty('instrument')
		expect(body.instrument).toHaveProperty('id')
		expect(body.instrument).toHaveProperty('address')
		expect(body.instrument).toHaveProperty('name')
		expect(body.instrument).toHaveProperty('symbol')
		expect(body.instrument).toHaveProperty('abi')
		expect(body.instrument.address).toBe(INSTRUMENTS.INSTRUMENT_1.address)
		expect(body.instrument.name).toBe(INSTRUMENTS.INSTRUMENT_1.name)
		expect(body.instrument.symbol).toBe(INSTRUMENTS.INSTRUMENT_1.symbol)
		expect(body.instrument.abi).toStrictEqual(INSTRUMENTS.INSTRUMENT_1.abi)
		done()
	})
})