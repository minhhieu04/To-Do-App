import { DataTypes, Model, Sequelize } from 'sequelize'

export type UserAttributes = {
  userId?: number
  name: string
  email: string
  password: string
  address?: string
  isVerified?: boolean
  updatedAt?: Date
}

export class User extends Model<UserAttributes> {
  declare userId: number
  declare name: string
  declare email: string
  declare password: string
  declare address?: string
  declare isVerified?: boolean
}

export default function (sequelize: Sequelize): typeof User {
  User.init(
    {
      userId: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      address: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'user'
    }
  )

  return User
}
