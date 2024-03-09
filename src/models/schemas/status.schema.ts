import { DataTypes, Model, Sequelize } from 'sequelize'

type StatusAttributes = {
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
      name: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'status'
    }
  )

  return Status
}
