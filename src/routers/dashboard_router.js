import { Router } from 'express'
import dashboardController from '../controllers/dashboard_controller.js'
import requireLogin from '../middleware/require_login.js'

const router = Router()

router.get('/dashboard', requireLogin, dashboardController)
router.get('/', function (req, res) {
  res.render('index', { currentPage: 'Home' })
})
router.get('/about', function (req, res) {
  res.render('index', { currentPage: 'About' })
})
router.get('/contact', function (req, res) {
  res.render('index', { currentPage: 'Contact' })
})

export default router
