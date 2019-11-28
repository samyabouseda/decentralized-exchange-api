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
		const response = await request.post('/users').send(USERS.DUMMY)
		const { status, body  } = response
		expect(status).toEqual(CREATED)
		expect(body).toHaveProperty('user')
		expect(body.user.username).toBe(USERS.DUMMY.username)
		done()
	})

	it('should fetch all users', async done => {
		const response = await request.get('/users')
		const { status, body } = response
		expect(status).toEqual(OK)
		expect(body).toHaveProperty('users')
		const { users } = body
		expect(users.length).toEqual(2)
		expect(users[0].username).toBe(USERS.USER_1.username)
		expect(users[1].username).toBe(USERS.USER_2.username)
		done()
	})

	it('should fetch a single user', async done => {
		const response = await request.get(`/users/${USERS.USER_1._id}`)
		const fetchedUser = response.body.user
		expect(response.status).toEqual(OK)
		expect(fetchedUser.username).toBe(USERS.USER_1.username)
		done()
	})

	it('should update a user', async done => {
		const response = await request.put(`/users/${USERS.USER_1._id}`).send({
			username: 'Thomas Shelby',
		})
		const { status, body } = response
		expect(status).toEqual(OK)
		expect(body.user.username).toEqual('Thomas Shelby')
		done()
	})

	it('should delete a user', async done => {
		const response = await request.delete(`/users/${USERS.USER_1._id}`)
		expect(response.status).toEqual(NO_CONTENT)
		const userFound = await User.findById(USERS.USER_1._id)
		expect(userFound).toBe(null)
		done()
	})

	it('should return status code 404 when user does NOT exist', async done => {
		const response = await request.get('/users/100')
		expect(response.status).toEqual(NOT_FOUND)
		done()
	})
})
