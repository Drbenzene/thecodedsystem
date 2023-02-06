import express from 'express'
import { protect, authorizeUser } from '../middleware/auth.js'
const router = express.Router()
import { createUser, loginUser } from '../controllers/usersController.js'

//create new user account
router.route('/register').post(createUser)

//login exisiting user
router.route('/login').post(loginUser)

export default router
