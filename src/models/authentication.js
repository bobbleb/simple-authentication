const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {
  refreshTokenExpiresIn,
  accessTokenExpiresIn,
  jwtSecret
} = require('./../../config/config')

const User = mongoose.model('user')
const RefreshToken = mongoose.model('refresh_token')

const createAccessToken = async (user = {}) => {
  const {
    _id,
    email,
    username,
    role
  } = user
  const accessToken = jwt.sign(
    {
      id: _id,
      email,
      username,
      role
    },
    jwtSecret,
    { expiresIn: accessTokenExpiresIn }
  )
  user.accessToken = accessToken

  return user
}

const decodeToken = async (token) => {
  const data = jwt.verify(token, jwtSecret, (_, decoded) => decoded)

  return data
}

const deleteRefreshToken = async (user) => {
  const decoded = await decodeToken(user.refreshToken)
  const addRefreshToken = await RefreshToken.deleteMany({
    user_id: mongoose.Types.ObjectId(decoded.id)
  })

  return addRefreshToken
}

const insertRefreshToken = async (user) => {
  const decoded = await decodeToken(user.refreshToken)
  const addRefreshToken = new RefreshToken({
    refresh_token: user.refreshToken,
    user_id: mongoose.Types.ObjectId(decoded.id),
    created_at: new Date(decoded.iat * 1000).toUTCString(),
    lastaccess_at: new Date(decoded.iat * 1000).toUTCString(),
    expires_at: new Date(decoded.exp * 1000).toUTCString()
  }).save()

  return addRefreshToken
}

const createRefreshToken = async (user) => {
  const { _id } = user
  const refreshToken = jwt.sign(
    { id: _id },
    jwtSecret,
    { expiresIn: refreshTokenExpiresIn }
  )

  const tokenUser = await createAccessToken(user)
  tokenUser.refreshToken = refreshToken
  await deleteRefreshToken(tokenUser)
  await insertRefreshToken(tokenUser)

  return tokenUser
}

const verifyRefreshToken = async (token) => {
  const decode = await decodeToken(token)
  let retrun = false
  if (decode) {
    const existdRefreshToken = await RefreshToken.findOne({ refresh_token: token })
    const date = new Date(existdRefreshToken.expires_at)
    const tokenExp = date.getTime() / 1000
    const now = Math.floor(Date.now() / 1000)

    if (now < tokenExp) {
      retrun = decode
    }
  }

  return retrun
}

const getAccessToken = async (refreshToken) => {
  const decodedUser = await decodeToken(refreshToken)
  const existedUser = await User.findOne({ _id: decodedUser.id })
  const user = await createAccessToken(existedUser)
  user.refreshToken = refreshToken
  await RefreshToken.updateOne(
    { refresh_token: refreshToken },
    { $set: { lastaccess_at: new Date() } }
  )
  return user
}

module.exports = {
  createRefreshToken,
  createAccessToken,
  verifyRefreshToken,
  getAccessToken
}
