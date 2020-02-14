import app from '../../app'
import supertest from 'supertest'
import { setupDB } from '../../test-setup'
import { CREATED, OK } from 'http-status-codes'
import Instrument from '../../models/Instrument'
import faker from 'faker'

const request = supertest(app)

const INSTRUMENTS = {
	INSTRUMENT_1: {
		address: `0x776a9b10c5fe6045F17B4B0da110672C${Math.round(
			Math.random() * 100000000,
		)}`,
		name: faker.company.companyName(),
		symbol: faker.company.companyName().substr(0, 3),
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
	INSTRUMENT_DUMMY: {
		address: `0x776a9b10c5fe6045F17B4B0da110672C${Math.round(
			Math.random() * 100000000,
		)}`,
		name: faker.company.companyName(),
		symbol: faker.company.companyName().substr(0, 3),
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

beforeEach(() => {
	// we have to return the promise that resolves when the database is initialized
	return initInstrumentDatabase()
})

const initInstrumentDatabase = async () => {
	await Instrument.create(INSTRUMENTS.INSTRUMENT_1)
}

describe('Instruments endpoint', () => {
	it('should register a new instrument', async done => {
		const response = await request.post('/instruments').send(INSTRUMENTS.INSTRUMENT_DUMMY)
		const { status, body } = response
		expect(status).toEqual(CREATED)
		expect(body).toHaveProperty('instrument')
		expect(body.instrument).toHaveProperty('id')
		expect(body.instrument).toHaveProperty('address')
		expect(body.instrument).toHaveProperty('name')
		expect(body.instrument).toHaveProperty('symbol')
		expect(body.instrument).toHaveProperty('abi')
		expect(body.instrument.address).toBe(INSTRUMENTS.INSTRUMENT_DUMMY.address)
		expect(body.instrument.name).toBe(INSTRUMENTS.INSTRUMENT_DUMMY.name)
		expect(body.instrument.symbol).toBe(INSTRUMENTS.INSTRUMENT_DUMMY.symbol)
		expect(body.instrument.abi).toStrictEqual(INSTRUMENTS.INSTRUMENT_DUMMY.abi)
		done()
	})

	it('should fetch all the registered instruments', async done => {
		const response = await request.get('/instruments')
		const { status, body } = response
		expect(status).toEqual(OK)
		expect(body).toHaveProperty('instruments')
		const { instruments } = body
		expect(instruments.length).toEqual(1)
		const instrument = instruments[0]
		expect(instrument).toHaveProperty('_id')
		expect(instrument).toHaveProperty('address')
		expect(instrument).toHaveProperty('name')
		expect(instrument).toHaveProperty('symbol')
		expect(instrument.name).toBe(INSTRUMENTS.INSTRUMENT_1.name)
		expect(instrument.address).toBe(INSTRUMENTS.INSTRUMENT_1.address)
		expect(instrument.symbol).toBe(INSTRUMENTS.INSTRUMENT_1.symbol)
		done()
	})

})
