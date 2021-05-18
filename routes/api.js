const express = require("express")
const router = express.Router()
const controller = require("../controllers/api")

router.get('/appForm/', controller.index)
router.post('/appForm/', controller.store)
module.exports = router