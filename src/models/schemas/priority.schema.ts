import { DataTypes, Model, Sequelize } from 'sequelize'

interface PriorityAttributes {
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
      priorityId: {
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
      modelName: 'priority'
    }
  )

  return Priority
}
