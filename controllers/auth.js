const User = require('../models/user')
const config = require('../config')
const mailer = require('../utils/mailer')

// Show Login Page - GET Request
module.exports.login = (req, res) => {
  let allowRegistration = config.allowRegistration
  res.render('auth/login',{
    title: 'Control Panel',
    layout: 'auth',
    loginError: req.flash('loginError'),
    allowRegistration,
    csrfToken: req.csrfToken()
  })
}

// Authenticate User - POST Request
module.exports.authenticate = async (req, res) => {
  const {email, password} = req.body
  let candidate = await User.findOne({"email": email.toLowerCase()})
  console.log(email, email.toLowerCase(), candidate)
  if(candidate){
    if(password === candidate.password){
      console.log('Password not same')
      req.session.isAuthenticated = true
      req.session.userName = candidate.name.split(' ')[0]
      res.redirect('/cp/')
    } else {
      req.flash('loginError', 'Incorrect password')
      res.redirect('/auth/login')
    }
  } else {
    req.flash('loginError', 'User not found')
    res.redirect('/auth/login')
 }
}

// Registration - POST Request
module.exports.registration = async (req, res) => {
  if(config.allowRegistration){
    let randPassword = randomstring = Math.random().toString(36).slice(-10); // random password 10 chars
    let newUser = new User({
      'name': req.body.name,
      'email': req.body.nemail.toLowerCase(),
      'password': randPassword,
      'notification': true
    })
    try {
      await newUser.save()
      let context = {
        name: req.body.name,
        email: req.body.nemail,
        password: randPassword,
        appUrl: req.headers.host
      }
      mailer.send(req.body.nemail, 'Created New Account in CELA15 Application Form Web App', 'newAccount', context)
    } catch(e) {
      console.log(e)
    }
    res.redirect('/cp')
  } else {
    res.redirect('/')
  }
}

// Logout from Control Panel
module.exports.logout = async (req, res) => {
    req.session.destroy(() => {
      res.redirect('/auth/login')
    })
}

// Reset Password
module.exports.reset = async(req, res) => {
  let email = req.body.remail
  let candidate = await User.findOne({'email':email})
  if(candidate) {
    candidateId = candidate.id
    let randPassword = randomstring = Math.random().toString(36).slice(-10); // random password 10 chars
    await User.findByIdAndUpdate({"_id": candidateId}, {'password':randPassword}, function(err, result){
      if(err) console.log(err)
      let context = {}
      context.appUrl = req.headers.host
      context.name = candidate.name
      context.email = candidate.email
      context.password = randPassword
      mailer.send(candidate.email, 'New password for account in CELA15 Application Form Web App', 'resetAccount', context)
      req.flash('loginError', `Password is updated, check your e-mail: ${candidate.email}`)
      res.redirect('/auth/login')
    })
  } else {
    req.flash('loginError', 'User not found')
    res.redirect('/auth/login')
  }
}