const express = require("express")
const router = express.Router()
const controller = require('../controllers/auth')

router.get('/login', controller.login)
router.get('/logout', controller.logout)
router.post('/login', controller.authenticate)
router.post('/registration', controller.registration)
router.post('/reset', controller.reset)

module.exports = router