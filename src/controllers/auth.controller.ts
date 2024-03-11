import session from 'express-session'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { ParamsDictionary } from 'express-serve-static-core'
import { OtpCode, User } from '~/models/schemas'
import { User as UserSchema } from '~/models/schemas/user.schema'
import { LoginReqBody, RegisterReqBody } from '~/models/request/user.requests'
import moment from 'moment'

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

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { name, password, email } = req.body

  try {
    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      return res.render('users/register', { message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const randomOTPCode = Math.floor(100000 + Math.random() * 900000).toString()

    const newUser = await User.create({ name, password: hashedPassword, email })

    // save otp in database
    const otpExpirationTime = moment().add(1, 'days').toDate()
    await OtpCode.create({
      userId: newUser.userId,
      otpCode: randomOTPCode,
      expiresAt: otpExpirationTime
    })

    // Send otp to user
    console.log({ randomOTPCode })
    return res.render('users/register', {
      message: 'User registered successfully. Please check your email for verification'
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}
