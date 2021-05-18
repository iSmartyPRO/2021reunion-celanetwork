const {Schema, model} = require('mongoose')

const log = new Schema({
  createdAt: {type: Date, default: new Date()},
  entryPoint: {type: String},
  ip: {type: String},
  country: {type: String},
  city: {type: String},
  userAgent: {type: String}
})

module.exports = model('log', log)