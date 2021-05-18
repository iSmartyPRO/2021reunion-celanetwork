const express = require("express")
const router = express.Router()
const controller = require("../controllers/cp")

router.get('/', controller.dashboard)
router.get('/applications', controller.applications)
router.get('/application/:id', controller.applicationView)
router.get('/logs', controller.logs)
router.get('/users', controller.users)
router.get('/export/xlsx', controller.exports)

module.exports = router