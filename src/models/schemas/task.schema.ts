import { DataTypes, Model, Sequelize } from 'sequelize'

type TaskAttributes = {
  taskId?: number
  userId: number
  title: string
  description: string
  dueDate: Date
  statusId: number
  priorityId: number
  updatedAt?: Date
}

export class Task extends Model<TaskAttributes> {
  declare taskId: number
  declare userId: number
  declare title: string
  declare description: string
  declare dueDate: Date
  declare statusId: number
  declare priorityId: number
}

export default function (sequelize: Sequelize): typeof Task {
  Task.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'userId'
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      dueDate: {
        type: DataTypes.DATE
      },
      statusId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Statuses',
          key: 'statusId'
        }
      },
      priorityId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Priorities',
          key: 'priorityId'
        }
      }
    },
    {
      sequelize,
      modelName: 'task'
    }
  )

  return Task
}
