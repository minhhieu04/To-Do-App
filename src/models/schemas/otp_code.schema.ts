import { DataTypes, Model, Sequelize } from 'sequelize'

interface OtpCodeAttributes {
  optCodeId?: number
  userId: number
  otpCode: string
  isUsed?: boolean
  expiresAt: Date
}

export class OtpCode extends Model<OtpCodeAttributes> {
  declare optCodeId: number
  declare userId: number
  declare otpCode: string
  declare isUsed: boolean
  declare expiresAt: Date
}

export default function (sequelize: Sequelize): typeof OtpCode {
  OtpCode.init(
    {
      optCodeId: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'userId'
        },
        onDelete: 'CASCADE'
      },
      otpCode: {
        type: DataTypes.STRING
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      expiresAt: {
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'otp_code'
    }
  )

  return OtpCode
}
