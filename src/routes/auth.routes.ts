import { Router } from 'express'
import { loginController } from '~/controllers/auth.controller'

const authRoutes = Router()

authRoutes.post('/login', loginController)

authRoutes.get('/login', (req, res) => {
  res.render('users/login')
})

export default authRoutes
