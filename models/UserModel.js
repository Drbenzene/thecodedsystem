import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: [false, 'business_name is required'],
    unique: true,
  },
  email: { type: String, required: [true, 'email is required'], unique: true },
  role: {
    type: String,
    required: false,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: { type: String, required: [false, 'password is required'] },
})

userSchema.methods.MatchPassword = async function (theAccountPassword) {
  return await bcrypt.compare(theAccountPassword, this.password)
}

userSchema.pre('save', async function (next) {
  console.log(this)
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(this.password, salt)
  this.password = hashed
})

//Sending Email Verification Token To User After Registration.
userSchema.methods.verification = function () {
  const user = this
  const token = JWT.sign({ ID: user._id }, process.env.EMAIL_TOKEN_SECRET, {
    expiresIn: '7d',
  })
  return token
}

const User = mongoose.model('User', userSchema)

export default User
