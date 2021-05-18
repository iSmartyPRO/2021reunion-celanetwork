const {Schema, model} = require('mongoose')

const user = new Schema({
  name: {type: String, required: true},
  email: {type: String,required: true, unique : true},
  password: {type: String,required: true},
  notification: {type: Boolean},
})

module.exports = model('user', user)