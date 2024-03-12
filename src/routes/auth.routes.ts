import { Router } from 'express'
import { loginController, registerController, verifyController } from '~/controllers/auth.controller'

const authRoutes = Router()

authRoutes.post('/login', loginController)
authRoutes.post('/register', registerController)
authRoutes.post('/verify', verifyController)

authRoutes.get('/login', (req, res) => {
  res.render('users/login')
})

authRoutes.get('/register', (req, res) => {
  res.render('users/register', { message: '' })
})

authRoutes.get('/verify', (req, res) => {
  res.render('users/verify', { message: '' })
})
export default authRoutes
