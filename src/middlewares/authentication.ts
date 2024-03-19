import { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import { User as UserSchema } from '~/models/schemas/user.schema'

interface CustomSession extends session.Session {
  user?: UserSchema
}

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req.session as CustomSession).user
  if (!user) return res.redirect('/auth/login')
  next()
}

export const checkLogged = (req: Request, res: Response, next: NextFunction) => {
  console.log('đã chạy tới đây')
  const session = req.session as CustomSession
  console.log(session)
  if (session.user) {
    return res.redirect('/tasks/')
  } else {
    next()
  }
}
