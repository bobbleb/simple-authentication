const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const AuthModel = require('./../models/authentication')

const User = mongoose.model('user')

const controller = {
  SignUp: async (args) => {
    const { name, email, password } = args.data
    const existedUser = await User.findOne({ email })

    if (existedUser) {
      throw new Error('Email already exists')
    } else {
      const hash = await bcrypt.hash(password, 10)
      const addUser = await User.create({
        name,
        email,
        password: hash,
        role: 'user'
      })
      await addUser.save()
      return AuthModel.createRefreshToken(addUser)
    }
  },
  SignIn: async (args) => {
    const { email, password } = args.data
    const existedUser = await User.findOne({ email })

    if (!existedUser) {
      throw new Error('Email not found')
    } else {
      const comparePass = await bcrypt.compare(password, existedUser.password)
      return comparePass ? AuthModel.createRefreshToken(existedUser) : Promise.reject(new Error('Password is incorrect'))
    }
  },
  GetToken: async (args) => {
    const existedRefreshToken = await AuthModel.verifyRefreshToken(args.refreshToken)

    if (!existedRefreshToken) {
      throw new Error('refreshToken is invalid or expired.')
    }

    const now = Math.floor(Date.now() / 1000)
    if (now >= existedRefreshToken.exp) {
      throw new Error('refreshToken expired')
    } else {
      return AuthModel.getAccessToken(args.refreshToken)
    }
  }
}

module.exports = controller
