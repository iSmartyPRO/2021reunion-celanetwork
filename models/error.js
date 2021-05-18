const {Schema, model} = require('mongoose')

const error = new Schema({
  errorArr: {type: [[]],required: true},
  createdAt: {type: Date, default: new Date()}
})

module.exports = model('error', error)