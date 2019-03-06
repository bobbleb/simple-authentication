const mongoose = require('mongoose')

const { Schema } = mongoose

const RefreshTokenSchema = new Schema({
  refresh_token: String,
  user_id: Object,
  created_at: Date,
  lastaccess_at: Date,
  expires_at: Date
})

RefreshTokenSchema.statics = {}

mongoose.model('refresh_token', RefreshTokenSchema)
