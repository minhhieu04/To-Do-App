import { config } from 'dotenv'
import { Dialect, Sequelize } from 'sequelize'
config()

const dbInfoSecret = {
  dbDevName: process.env.DB_DEV_NAME as string,
  dbDevUsername: process.env.DB_DEV_USERNAME as string,
  dbDevPassword: process.env.DB_DEV_PASSWORD as string
}
export const sequelize = new Sequelize(dbInfoSecret.dbDevName, dbInfoSecret.dbDevUsername, dbInfoSecret.dbDevPassword, {
  host: process.env.SEQUELIZE_HOST,
  dialect: 'mysql',
  timezone: '+07:00',
  logging: false
})

export const dbConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection database success.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
