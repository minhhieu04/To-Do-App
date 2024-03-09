import { DataTypes, Model, Sequelize } from 'sequelize'

type PriorityAttributes = {
  priorityId?: number
  name: string
}

export class Priority extends Model<PriorityAttributes> {
  declare priorityId: number
  declare name: string
}

export default function (sequelize: Sequelize): typeof Priority {
  Priority.init(
    {
      name: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'priority'
    }
  )

  return Priority
}
