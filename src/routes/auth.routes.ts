import { Router } from 'express'
import { loginController, registerController } from '~/controllers/auth.controller'

const authRoutes = Router()

authRoutes.post('/login', loginController)
authRoutes.post('/register', registerController)

authRoutes.get('/login', (req, res) => {
  res.render('users/login')
})

authRoutes.get('/register', (req, res) => {
  res.render('users/register', { message: '' })
})
export default authRoutes
