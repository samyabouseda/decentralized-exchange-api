import app from '../../app'
import supertest from 'supertest'
import { setupDB } from '../../test-setup'
import {
	ACCEPTED,
	CREATED,
	OK,
	EXPECTATION_FAILED,
} from 'http-status-codes'
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
				type: 'event',
				inputs: [
					{ name: 'a', type: 'uint256', indexed: true },
					{ name: 'b', type: 'bytes32', indexed: false },
				],
				name: 'Event',
			},
			{
				type: 'event',
				inputs: [
					{ name: 'a', type: 'uint256', indexed: true },
					{ name: 'b', type: 'bytes32', indexed: false },
				],
				name: 'Event2',
			},
			{
				type: 'function',
				inputs: [{ name: 'a', type: 'uint256' }],
				name: 'foo',
				outputs: [],
			},
		],
	},
	INSTRUMENT_DUMMY: {
		address: `0x776a9b10c5fe6045F17B4B0da110672C${Math.round(
			Math.random() * 100000000,
		)}`,
		name: faker.company.companyName(),
		symbol: faker.company.companyName().substr(0, 3),
		abi: [
			{
				type: 'event',
				inputs: [
					{ name: 'a', type: 'uint256', indexed: true },
					{ name: 'b', type: 'bytes32', indexed: false },
				],
				name: 'Event',
			},
			{
				type: 'event',
				inputs: [
					{ name: 'a', type: 'uint256', indexed: true },
					{ name: 'b', type: 'bytes32', indexed: false },
				],
				name: 'Event2',
			},
			{
				type: 'function',
				inputs: [{ name: 'a', type: 'uint256' }],
				name: 'foo',
				outputs: [],
			},
		],
	},
}

setupDB()

beforeEach(() => {
	// we have to return the promise that resolves when the database is initialized
	return initInstrumentDatabase()
})

const initInstrumentDatabase = async () => {
	await Instrument.create(INSTRUMENTS.INSTRUMENT_1)
	await Instrument.create(INSTRUMENTS.INSTRUMENT_DUMMY)
}

describe('Orders endpoint', () => {
	it('should place an order', async done => {
		expect(true).to.be(false)
		done()
	})
})
