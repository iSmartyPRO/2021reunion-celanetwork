const fs = require('fs')
const path = require('path')
const moment = require('moment')
const logger = require('../utils/logger')
const config = require('../config')

module.exports.home = (req, res) => {
    let countries = JSON.parse(fs.readFileSync('./data/countries.json', 'utf8'))
    let networks = JSON.parse(fs.readFileSync('./data/networks.json', 'utf8'))
    let todayDate = new Date()
    let todayDateFormat = moment(todayDate).format('DD.MM.yyyy')
    logger.add(req, 'frontSite')
    let classYears = []
    let startClassYear = 1991
    let endClassYear = 2020
    for (let i = startClassYear; i <= endClassYear; i++) {
        classYears.push(i)
    }
    let showAppForm = config.showAppForm
    res.render('appForm', { layout: 'frontSite', showAppForm, countries, networks, todayDateFormat, classYears, csrfToken: req.csrfToken() })
}