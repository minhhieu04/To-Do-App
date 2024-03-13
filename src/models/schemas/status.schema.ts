import { DataTypes, Model, Sequelize } from 'sequelize'

interface StatusAttributes {
  statusId?: number
  name: string
}

export class Status extends Model<StatusAttributes> {
  declare statusId: number
  declare name: string
}

export default function (sequelize: Sequelize): typeof Status {
  Status.init(
    {
      statusId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(50)
      }
    },
    {
      sequelize,
      modelName: 'status'
    }
  )

  return Status
}
