const { Schema, model } = require('mongoose')

const regForm = new Schema({
    createdAt: { type: Date, default: new Date() },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    networkName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    passportNumber: { type: String, required: true },
    dietaryRestrictions: { type: String, required: false },
    feeKutaisi: { type: String, required: true },
    feeSvaneti: { type: String, required: true },
    aFullName: { type: String, required: false },
    aCompany: { type: String, required: false },
    aPhone: { type: String, required: false },
    optionalActivity: { type: String, required: false },
    covidVaccinated: { type: Boolean, required: true },
    covidDoVaccinate: { type: Boolean, required: false },
})

module.exports = model('regForm', regForm)