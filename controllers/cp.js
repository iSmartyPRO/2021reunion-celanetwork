const fs = require('fs')
const path = require('path')
const Log = require('../models/log')
const RegistrationForms = require('../models/registrationForm')
const User = require('../models/user')
const exportToExel = require('../utils/exportToExel')


module.exports.dashboard = async(req, res) => {
    if (req.session.isAuthenticated === true) {
        let data = {}
        data.frontSiteStats = await Log.find({ "entryPoint": "frontSite" }).countDocuments().lean()
        data.applicationsStats = await RegistrationForms.find().countDocuments().lean()
        data.userStats = await User.find().countDocuments().lean()
        res.render('cp/dashboard', { data })
    } else {
        res.redirect('/auth/login')
    }
}
module.exports.registrations = async(req, res) => {
    if (req.session.isAuthenticated === true) {
        let applications = await RegistrationForms.find().lean()
        res.render('cp/registrations', { applications })
    } else {
        res.redirect('/auth/login')
    }
}
module.exports.registrationView = async(req, res) => {
    if (req.session.isAuthenticated === true) {
        console.log(req.params)
        let registration = await RegistrationForms.findById(req.params.id).lean()
        let fees = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'fees.json'), { encoding: 'utf8', flag: 'r' }))
        let feeKutaisi = fees.feeKutaisi[registration.feeKutaisi]
        let feeSvaneti = fees.feeSvaneti[registration.feeSvaneti]
        res.render('cp/registrationView', { registration, feeKutaisi, feeSvaneti })
    } else {
        res.redirect('/auth/login')
    }
}

module.exports.logs = async(req, res) => {
    if (req.session.isAuthenticated === true) {
        try {
            const logData = await Log.find().sort({ "createdAt": -1 }).lean()
            console.log('typeof ', typeof logData)
            res.render('cp/logs', { logData: logData })
        } catch (e) {
            console.log(e)
        }

    } else {
        res.redirect('/auth/login')
    }
}
module.exports.users = async(req, res) => {
    if (req.session.isAuthenticated === true) {
        try {
            const users = await User.find().lean()
            res.render('cp/users', { users })
        } catch (e) {
            console.log(e)
        }

    } else {
        res.redirect('/auth/login')
    }
}



module.exports.exports = async(req, res) => {
    if (req.session.isAuthenticated === true) {
        await exportToExel.export()
        let downloadPath = path.join(__dirname, '..', 'exports', '2021 Reunion Registrations.xlsx')
        res.download(downloadPath, function(err) {
            if (err) {
                if (res.headerSent) {
                    console.log('Header is sent')
                } else {
                    return res.sendStatus(404)
                }
            }
            res.end()
        })
    } else {
        res.redirect('/auth/login')
    }
}