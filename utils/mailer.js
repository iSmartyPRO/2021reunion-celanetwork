const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const config = require('../config')

module.exports.send = async(mailTo, mailSubject, mailTemplate, context) => {
    return new Promise((resolve, reject) => {
        let transport = nodemailer.createTransport({
            host: config.mailHost,
            port: 465,
            secure: true,
            auth: {
                user: config.mailUser,
                pass: config.mailPass
            }
        })
        transport.use('compile', hbs({
            viewEngine: {
                partialsDir: __dirname + '/mailer/partials',
                layoutsDir: __dirname + '/mailer/layouts',
                extname: '.hbs',
                helpers: require('./hbs-helpers')

            },
            viewPath: __dirname + '/mailer/views',
            extName: '.hbs',
        }))
        message = {
            from: config.mailFrom,
            to: mailTo,
            subject: ' ✔ ' + mailSubject,
            template: mailTemplate,
            context
        }
        transport.sendMail(message, async function(err, info) {
            if (err) {
                console.log(err)
                resolve(false)
            } else {
                console.log('E-mail is send to:', mailTo + '(' + message.context.username + ')')
                resolve(true)
            }
        })


    })




}