import { DataTypes, Model, Sequelize } from 'sequelize'

interface TaskAttributes {
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
      taskId: {
        type: DataTypes.INTEGER,
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
      title: {
        type: DataTypes.STRING(100)
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
          model: 'statuses',
          key: 'statusId'
        }
      },
      priorityId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'priorities',
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
