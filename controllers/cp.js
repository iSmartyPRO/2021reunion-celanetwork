const Log = require('../models/log')
const ApplicationForms = require('../models/applicationForm')
const User = require('../models/user')
const exportToExel = require('../utils/exportToExel')
const fs = require('fs')
const path = require('path')

module.exports.dashboard = async (req, res) => {
    if(req.session.isAuthenticated === true){
        let data = {}
        data.frontSiteStats = await Log.find({"entryPoint":"frontSite"}).countDocuments().lean()
        data.applicationsStats = await ApplicationForms.find().countDocuments().lean()
        data.userStats = await User.find().countDocuments().lean()
        res.render('cp/dashboard', {data})
    } else {
        res.redirect('/auth/login')
    }
}
module.exports.applications = async (req, res) => {
    if(req.session.isAuthenticated === true){
        let applications = await ApplicationForms.find().lean()
        res.render('cp/applications', {applications})
    } else {
        res.redirect('/auth/login')
    }
}
module.exports.applicationView = async(req, res) => {
    if(req.session.isAuthenticated === true){
        console.log(req.params)
        let application = await ApplicationForms.findById(req.params.id).lean()
        console.log(application)
        res.render('cp/applicationView', {application})
    } else {
        res.redirect('/auth/login')
    }
}

module.exports.logs = async (req, res) => {
    if(req.session.isAuthenticated === true){
        try {
            const logData = await Log.find().sort({"createdAt":-1}).lean()
            console.log('typeof ',typeof logData)
            res.render('cp/logs',{logData:logData})
        } catch(e) {
            console.log(e)
        }

    } else {
        res.redirect('/auth/login')
    }
}
module.exports.users = async(req, res) => {
    if(req.session.isAuthenticated === true){
        try {
            const users = await User.find().lean()
            res.render('cp/users',{users})
        } catch(e) {
            console.log(e)
        }

    } else {
        res.redirect('/auth/login')
    }
}



module.exports.exports = async(req, res) => {
    if(req.session.isAuthenticated === true){
        await exportToExel.export()
        let downloadPath = path.join(__dirname, '..','exports', 'CELA15 Facilitators Application Forms.xlsx')
        res.download(downloadPath, function(err){
            if(err){
                if(res.headerSent){
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