const express = require("express")
const router = express.Router()
const controller = require("../controllers/api")

router.get('/regForm/', controller.index)
router.post('/regForm/', controller.store)
module.exports = router