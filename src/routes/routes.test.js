import HttpStatus from 'http-status-codes'
import app from '../app'
import supertest from 'supertest'
import { setupDB } from '../test-setup'

const request = supertest(app)

setupDB('routes')

describe('API', () => {
	it('is connected', async done => {
		const response = await request.get('/')
		expect(response.status).toBe(HttpStatus.OK)
		expect(response.body.message).toBe('Connected')
		done()
	})
})
