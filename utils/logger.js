const Log = require('../models/log')
const fetch = require('node-fetch')

module.exports.add = async (req, entryPoint) => {
  fetch('http://ip-api.com/json/'+req.headers['x-forwarded-for'])
  .then(res => res.json())
  .then(ipInfo => {
    let newLog = new Log({
      entryPoint,
      ip: req.headers['x-forwarded-for'],
      country: ipInfo.country,
      city: ipInfo.city,
      userAgent: req.headers['user-agent']
    })
    newLog.save()
  })


}