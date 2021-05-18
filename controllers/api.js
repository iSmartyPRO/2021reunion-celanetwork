const AppForm = require('../models/applicationForm')
const Error = require('../models/error')
const logger = require('../utils/logger')
const mailer = require('../utils/mailer')
const User = require('../models/user')

function isValidDate(dateString) {
    if (!/^\d{1,2}[.]\d{1,2}[.]\d{4}$/.test(dateString)) return false;
    let dateStringArr = dateString.split('.')
    if (Number(dateStringArr[0]) < 1 || Number(dateStringArr[0]) > 31) return false;
    if (Number(dateStringArr[1]) < 1 || Number(dateStringArr[1]) > 12) return false;
    if (Number(dateStringArr[2]) < 1940 || Number(dateStringArr[2]) > 2015) return false;
    return true;
};

function isValidTextArea(textareaString, wordQnty = 500) {
    if (textareaString.length < 2) return false
    let textWords = textareaString.split(' ').length
    if (textWords > wordQnty) return false
    return true
}

function validate(data) {
    let errors = []
    let result = {}
        // Validation
    const emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if ((typeof data.fullName === 'undefined') || (data.fullName.length < 4)) { errors.push('Full Name is not valid') }
    if ((typeof data.networkName === 'undefined') || (data.networkName === "null")) { errors.push('Network name is not valid') }
    if ((typeof data.networkName === 'undefined') || (data.networkName === "null")) { errors.push('Network class year is not valid') }
    if ((typeof data.countryCitizen === 'undefined') || (data.countryCitizen === "null")) { errors.push('Country is not valid') }
    if ((typeof data.DoB === 'undefined') || (isValidDate(data.DoB) != true)) { errors.push('Date of Birth is not valid') }
    if ((typeof data.currentResidence === 'undefined') || (data.currentResidence.length < 4)) { errors.push('Current residence is not valid') }
    if ((typeof data.title === 'undefined') || (data.title.length < 2)) { errors.push('Title is not valid') }
    if ((typeof data.companyName === 'undefined') || (data.companyName.length < 2)) { errors.push('Company Name is not valid') }
    if ((typeof data.companyIndustry === 'undefined') || (data.companyIndustry.length < 2)) { errors.push('Company Industry is not valid') }
    if ((typeof data.email === 'undefined') || (emailRe.test(data.email) != true)) { errors.push('E-mail is not valid') }
    if ((typeof data.phone === 'undefined') || (data.phone.length < 2)) { errors.push('Phone is not valid') }
    if ((typeof data.bio === 'undefined') || (isValidTextArea(data.bio, 250) != true)) { errors.push(`Bio information is not valid.`) }
    if ((typeof data.isEnglish === 'undefined') || (isValidTextArea(data.isEnglish)) != true) { errors.push(`About English Information is not valid.`) }
    if ((typeof data.whyYouFacilitator === 'undefined') || (isValidTextArea(data.whyYouFacilitator)) != true) { errors.push(`Why Facilitator Information is not valid.`) }
    if ((typeof data.experienceInfo === 'undefined') || (isValidTextArea(data.experienceInfo)) != true) { errors.push(`Experience Information is not valid.`) }
    if ((typeof data.whoFacilitator === 'undefined') || (isValidTextArea(data.whoFacilitator)) != true) { errors.push(`Who Facilitator Information is not valid.`) }
    if ((typeof data.references === 'undefined') || (isValidTextArea(data.references)) != true) { errors.push(`References Information is not valid.`) }
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
        //console.log(req.headers)
    validationResult = validate(d)
    if (validationResult.status === "OK") {
        let context = {
            fullName: d.fullName,
            networkName: d.networkName,
            networkClassYear: d.networkClassYear,
            countryCitizen: d.countryCitizen,
            DoB: d.DoB,
            currentResidence: d.currentResidence,
            title: d.title,
            companyName: d.companyName,
            companyIndustry: d.companyIndustry,
            email: d.email,
            phone: d.phone,
            bio: d.bio,
            isEnglish: d.isEnglish,
            whyYouFacilitator: d.whyYouFacilitator,
            experienceInfo: d.experienceInfo,
            whoFacilitator: d.whoFacilitator,
            references: d.references,
            authPhotos: d.authPhotos === 'yes' ? true : false
        }
        const appData = new AppForm(context)
        try {
            let notificationUsers = await User.find({ "notification": true }).lean()
            await appData.save(async function(err, application) {
                context.id = application.id
                context.appUrl = req.headers.host
                for (i = 0; i < notificationUsers.length; i++) {
                    context.username = notificationUsers[i].name
                    await mailer.send(notificationUsers[i].email, 'New Application Form from ' + d.fullName, 'newAppForm', context)
                }
                await mailer.send(context.email, 'CELA15 Facilitators Registration', 'notificationToParticipant', context)
            })
            logger.add(req, 'apiSaved')

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