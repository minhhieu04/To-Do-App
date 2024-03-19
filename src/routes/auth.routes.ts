import { Router } from 'express'
import {
  loginController,
  logoutController,
  registerController,
  resendOtpController,
  verifyController
} from '~/controllers/auth.controller'
import { checkLogged } from '~/middlewares/authentication'

const authRoutes = Router()

authRoutes.post('/login', checkLogged, loginController)
authRoutes.post('/register', checkLogged, registerController)
authRoutes.post('/verify', verifyController)
authRoutes.post('/resend', resendOtpController)
authRoutes.post('/logout', logoutController)

authRoutes.get('/login', checkLogged, (req, res) => {
  res.render('users/login', { message: '' })
})

authRoutes.get('/register', checkLogged, (req, res) => {
  res.render('users/register', { message: '' })
})

authRoutes.get('/verify', (req, res) => {
  res.render('users/verify', { message: '' })
})
export default authRoutes
