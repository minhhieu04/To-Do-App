import session from 'express-session'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { ParamsDictionary } from 'express-serve-static-core'
import { OtpCode, User } from '~/models/schemas'
import { User as UserSchema } from '~/models/schemas/user.schema'
import { LoginReqBody, RegisterReqBody, ResendOTPBody } from '~/models/request/user.requests'
import moment from 'moment'
import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import { saveOtpAndSendEmail } from '~/utils/mailer'
import { Op } from 'sequelize'
import { generateCode } from '~/utils/generates'

interface CustomSession extends session.Session {
  user?: UserSchema
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  try {
    const { email, password } = req.body
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

    const session = req.session as CustomSession
    session.user = user

    if (user.isVerified === false) {
      return res.redirect('/verify')
    }

    res.redirect('/tasks/')
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}

export const registerController = async (req: Request, res: Response) => {
  const { name, password, email } = req.body

  try {
    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      return res.render('users/register', { message: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ name, password: hashedPassword, email })

    await saveOtpAndSendEmail(newUser.userId, email)

    const session = req.session as CustomSession
    session.user = newUser
    return res.redirect('/auth/verify')
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}

export const verifyController = async (req: Request, res: Response) => {
  try {
    const { otpCode } = req.body
    const userId: number = (req.session as CustomSession).user?.userId as number

    const otpRecord = await OtpCode.findOne({
      where: { userId, otpCode, isUsed: false, expiresAt: { [Op.gt]: new Date() } },
      order: [['expiresAt', 'DESC']]
    })
    if (!otpRecord) {
      return res.status(400).render('users/verify', { message: 'Invalid OTP code' })
    }

    // OTP code is valid, update isUsed in the otpcode table and isVerified in the user table to true
    otpRecord.isUsed = true
    Promise.all([otpRecord.save(), User.update({ isVerified: true }, { where: { userId: userId } })])
    return res.status(200).redirect('/auth/login')
  } catch (error) {
    console.error('Verify error:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}

export const resendOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(404).json({ message: 'Email not found' })
    }

    if (user?.isVerified === true) {
      return res.status(400).json({ message: 'User has been verified before' })
    }

    await saveOtpAndSendEmail(user.userId, email)

    return res.status(201).json({
      message: 'An OTP code has been sent to your email. Please check your email for verification'
    })
  } catch (error) {
    console.error('Resend error:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}

export const logoutController = async (req: Request, res: Response) => {
  try {
    if (!(req.session as CustomSession).user) {
      return res.render('error', { message: 'User is not logged in' })
    }
    // remove the session
    ;(req.session as CustomSession).destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err)
        return res.status(500).render('error', { message: 'Failed to logout' })
      }
      return res.redirect('/auth/login')
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).render('error', { message: 'Failed to logout' })
  }
}
