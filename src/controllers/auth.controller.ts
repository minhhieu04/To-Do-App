import session from 'express-session'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { ParamsDictionary } from 'express-serve-static-core'
import { User } from '~/models/schemas'
import { User as UserSchema } from '~/models/schemas/user.schema'
import { LoginReqBody } from '~/models/request/user.requests'

interface CustomSession extends session.Session {
  user?: UserSchema
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const { email, password } = req.body

  try {
    // find user in the database by email
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(404).render('users/login', { message: 'Email or password is incorrect' })
    }
    // check password
    const ValidPassword = await bcrypt.compare(password, user.dataValues.password)
    if (!ValidPassword) {
      return res.status(404).render('users/login', { message: 'Email or password is incorrect' })
    }

    if (user.isVerified === false) {
      return res.render('verify', { message: 'Please verify your account to log in' })
    }

    const session = req.session as CustomSession
    session.user = user
    res.redirect('/tasks-dashboard')
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}
