import app from '../app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { setupDB } from '../test-setup'
import User from '../models/User'
import { CREATED, NO_CONTENT, NOT_FOUND, OK } from 'http-status-codes'

const request = supertest(app)

const generateObjectId = () => mongoose.Types.ObjectId()

const USERS = {
	USER_1: {
		_id: generateObjectId(),
		username: 'John'
	},
	USER_2: {
		_id: generateObjectId(),
		username: 'Alice'
	},
	DUMMY: {
		_id: generateObjectId(),
		username: 'dummyuser'
	},
}

setupDB()

beforeEach(() => {
	// we have to return the promise that resolves when the database is initialized
	return initUserDatabase()
})

const initUserDatabase = async () => {
	await User.create(USERS.USER_1)
	await User.create(USERS.USER_2)
}

describe('User endpoint', () => {
	it('should create a new  user', async done => {
		const response = await request.post('/accounts').send(USERS.DUMMY)
		const { status, body } = response
		expect(status).toEqual(CREATED)
		expect(body).toHaveProperty('user')
		expect(body.user.username).toBe(USERS.DUMMY.username)
		done()
	})

	it('should fetch all users', async done => {
		const response = await request.get('/accounts')
		const { status, body } = response
		expect(status).toEqual(OK)
		expect(body).toHaveProperty('users')
		const { users } = body
		expect(users.length).toEqual(2)
		expect(users[0].username).toBe(USERS.USER_1.username)
		expect(users[1].username).toBe(USERS.USER_2.username)
		done()
	})
})
