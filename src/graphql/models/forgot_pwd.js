const mongoose = require('mongoose')

const { Schema } = mongoose

const ForgotSchema = new Schema({
  email: String,
  created_ip: String,
  expires_at: Date,
  reseted_status: Boolean,
  reseted_ip: String
},
{
  timestamps: true
})

ForgotSchema.statics = {}

mongoose.model('forgot_pwd', ForgotSchema)
