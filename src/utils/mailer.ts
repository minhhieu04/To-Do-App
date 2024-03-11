import nodemailer, { Transporter } from 'nodemailer'
import { OAuth2Client } from 'google-auth-library'
import { config } from 'dotenv'
config()

const GOOGLE_MAILER_CLIENT_ID: string = process.env.GOOGLE_MAILER_CLIENT_ID as string
const GOOGLE_MAILER_CLIENT_SECRET: string = process.env.GOOGLE_MAILER_CLIENT_SECRET as string
const GOOGLE_MAILER_REFRESH_TOKEN: string = process.env.GOOGLE_MAILER_REFRESH_TOKEN as string
const ADMIN_EMAIL_ADDRESS: string = process.env.ADMIN_EMAIL_ADDRESS as string

// Khởi tạo OAuth2Client với Client ID và Client Secret
const myOAuth2Client: OAuth2Client = new OAuth2Client(GOOGLE_MAILER_CLIENT_ID, GOOGLE_MAILER_CLIENT_SECRET)

// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})

const getAccessToken = async (): Promise<string> => {
  try {
    const { token } = await myOAuth2Client.getAccessToken()
    return token as string
  } catch (error) {
    throw new Error('Error getting access token: ' + error)
  }
}

const createTransporter = async (): Promise<Transporter> => {
  try {
    const myAccessToken: string = await getAccessToken()

    const transport: Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: ADMIN_EMAIL_ADDRESS,
        clientId: GOOGLE_MAILER_CLIENT_ID,
        clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
        refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
        accessToken: myAccessToken
      }
    })

    return transport
  } catch (error) {
    throw new Error('Error creating transporter: ' + error)
  }
}

export const sendMail = async ({ to, subject, html }: { to: string; subject?: string; html: string }) => {
  try {
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to,
      subject: subject || '',
      html
    }

    const emailTransporter = await createTransporter()
    await emailTransporter.sendMail(mailOptions)
    console.log('Email sent successfully.')
  } catch (err) {
    console.log('ERROR: ', err)
  }
}
