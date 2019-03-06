const mongoose = require('mongoose')

const { Schema } = mongoose

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'case_handler', 'user'],
    default: 'user'
  }
},
{
  timestamps: true
})

UserSchema.statics = {}

mongoose.model('user', UserSchema)
