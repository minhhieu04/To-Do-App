import express, { Application, Request, Response } from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'
import { dbConnection } from './config/dbconnect'
import session from 'express-session'
import { config } from 'dotenv'
import authRoutes from './routes/auth.routes'
import taskRoutes from './routes/task.routes'

config()

const app: Application = express()
const corsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Accept', 'Accept-Encoding', 'Accept-Language', 'Authorization']
}
const PORT = process.env.PORT || 3000

express.json({})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true: https
      maxAge: 60 * 60 * 1000 // 60 minutes
    }
  })
)
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(express.static(path.join('public')))

app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

console.log(path.resolve('src/views/users/sendOTP.ejs'))
dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Unable to start the server:', error)
  })
