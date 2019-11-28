import { Schema, model } from 'mongoose'

// TODO: Create an API for the models so devs don't need to know about the DB used (not the ORM)
const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
})

userSchema.statics.findByLogin = async function(login) {
	let user = await this.findOne({
		username: login,
	})

	if (!user) {
		user = await this.findOne({ email: login })
	}

	return user
}

userSchema.pre('remove', next =>
	this.model('Message').deleteMany({ user: this._id }, next),
)

const User = model('User', userSchema)

export default User
