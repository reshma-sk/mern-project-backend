const express = require('express')
const {handleCreateNewUser,handleGetAllUsers,handleUserLogin} = require('../controller/user')
const router = express.Router()
router
.route('/')
.get(handleGetAllUsers)
.post(handleCreateNewUser)

router.post("/login",handleUserLogin)


module.exports = router;