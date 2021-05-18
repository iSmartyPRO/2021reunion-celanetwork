const {Schema, model} = require('mongoose')

const appForm = new Schema({
  fullName: {type: String,required: true},
  networkName: {type: String,required: true},
  networkClassYear: {type: String,required: true},
  countryCitizen: {type: String,required: true},
  DoB: {type: String,required: true},
  currentResidence: {type: String,required: true},
  title: {type: String,required: true},
  companyName: {type: String,required: true},
  companyIndustry: {type: String,required: true},
  email: {type: String,required: true},
  phone: {type: String,required: true},
  bio: {type: String,required: true},
  isEnglish: {type: String,required: true},
  whyYouFacilitator: {type: String,required: true},
  experienceInfo: {type: String,required: true},
  whoFacilitator: {type: String,required: true},
  references: {type: String,required: true},
  authPhotos: {type: Boolean,required: true},
  createdAt: {type: Date, default: new Date()}
})

module.exports = model('appForm', appForm)