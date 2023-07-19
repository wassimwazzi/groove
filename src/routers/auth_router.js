// router file for authentication
import { Router } from 'express'
import { login, callback } from '../controllers/auth_controller.js'

const router = Router()

router.get('/login', login)
router.get('/callback', callback)

export default router
