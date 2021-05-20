const RegForm = require('../models/registrationForm')
const Error = require('../models/error')
const logger = require('../utils/logger')
const mailer = require('../utils/mailer')
const User = require('../models/user')
const fs = require('fs')
const path = require('path')


function validate(data) {
    let errors = []
    let result = {}
        // Validation
    const emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if ((typeof data.firstName === 'undefined') || (data.firstName.length < 4)) { errors.push('First Name is not valid') }
    if ((typeof data.lastName === 'undefined') || (data.lastName.length < 4)) { errors.push('Last Name is not valid') }
    if ((typeof data.country === 'undefined') || (data.country === "null")) { errors.push('Country is not valid') }
    if ((typeof data.mobile === 'undefined') || (data.mobile.length < 2)) { errors.push('Mobile is not valid') }
    if ((typeof data.email === 'undefined') || (emailRe.test(data.email) != true)) { errors.push('E-mail is not valid') }
    if ((typeof data.passportNumber === 'undefined') || (data.passportNumber.length < 4)) { errors.push('Passport Number is not valid') }
    console.log(data.passportNumber)
    if ((typeof data.networkName === 'undefined') || (data.networkName === "null")) { errors.push('Network name is not valid') }
    if (data.feeKutaisi == 'null' && data.feeSvaneti == 'null') {
        if ((typeof data.feeKutaisi === 'undefined') || (data.feeKutaisi === "null")) { errors.push('Option is not valid') }
        if ((typeof data.feeSvaneti === 'undefined') || (data.feeSvaneti === "null")) { errors.push('Option is not valid') }
    }
    if (data.covidVaccinated === 'null') { errors.push('Covid Check is Null, shouldnt be...') }
    if (data.covidVaccinated === 'No' && data.covidDoVaccinate === "null") { errors.push('Select your plan about COVID vaccination') }
    if (errors.length > 0) {
        result.status = "Bad"
        result.errors = errors
    } else {
        result.status = "OK"
    }
    return result
}


module.exports.index = async(req, res) => {
    res.json({ "status": 'ok' })
}
module.exports.store = async(req, res) => {
    const d = req.body
    validationResult = validate(d)
    if (validationResult.status === "OK") {
        console.log(d)
        let context = {
            createdAt: new Date(),
            firstName: d.firstName,
            lastName: d.lastName,
            country: d.country,
            networkName: d.networkName,
            mobile: d.mobile,
            email: d.email,
            passportNumber: d.passportNumber,
            dietaryRestrictions: d.dietaryRestrictions,
            feeKutaisi: d.feeKutaisi,
            feeSvaneti: d.feeSvaneti,
            aFullName: d.aFullName ? d.aFullName : null,
            aCompany: d.aCompany ? d.aCompany : null,
            aPhone: d.aPhone ? d.aPhone : null,
            optionalActivity: d.optionalActivity ? d.optionalActivity : null,
            covidVaccinated: d.covidVaccinated == 'yes' ? true : false,
            covidDoVaccinate: d.covidDoVaccinate == 'yes' ? true : false
        }
        console.log(context)
        const regData = new RegForm(context)
        try {
            let notificationUsers = await User.find({ "notification": true }).lean()
            await regData.save(async function(err, registration) {
                context.id = registration.id
                context.appUrl = req.headers.host
                for (i = 0; i < notificationUsers.length; i++) {
                    context.username = notificationUsers[i].name
                    let fees = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'fees.json'), { encoding: 'utf8', flag: 'r' }))
                    context.Kutaisi = fees.feeKutaisi[registration.feeKutaisi] ? fees.feeKutaisi[registration.feeKutaisi] : 'Empty, no data'
                    context.Svaneti = fees.feeSvaneti[registration.feeSvaneti] ? fees.feeSvaneti[registration.feeSvaneti] : 'Empty, no data'
                    await mailer.send(notificationUsers[i].email, `New Registration from  ${d.firstName} ${d.lastName} `, 'newAppForm', context)
                }
                await mailer.send(context.email, 'Reunion 2021 Registration', 'notificationToParticipant', context)
                logger.add(req, 'apiSaved')

            })



        } catch (e) {
            console.log(e)
        }
        res.json(validationResult)
    } else {
        console.log(req)
        let errorDb = new Error({
            "errorArr": validationResult.errors
        })
        res.json(await errorDb.save())
    }
}