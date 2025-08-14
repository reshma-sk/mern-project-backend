const express = require('express')
const {authMiddleware} = require('../middleware/auth')
const {admin} = require('../middleware/adminOnly')
const {handleCreateNewUser,handleGetAllUsers,handleUserLogin,handleProtected,handleRefreshToken,handlePromoteToAdmin} = require('../controller/user')
const router = express.Router()

const{body,validationResult} = require('express-validator')

router
.route('/')
.get(handleGetAllUsers)
.post([body('fullName').isLength({min:3}).withMessage('Full name should be at least 3 characters'),,
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min:5}).withMessage('Password should be at least 5 characters'),
], handleCreateNewUser)

router.post("/login",handleUserLogin)
router.get('/protected', authMiddleware,handleProtected) 
router.post("/refresh-token",handleRefreshToken)
router.put("/make-admin/:id", authMiddleware, admin, handlePromoteToAdmin);
module.exports = router;