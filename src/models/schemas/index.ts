import UserFactory from './user.schema'
import TaskFactory from './task.schema'
import StatusFactory from './status.schema'
import PriorityFactory from './priority.schema'
import OtpCodeFactory from './otp_code.schema'
import { sequelize } from '~/config/dbconnect'

const User = UserFactory(sequelize)
const Task = TaskFactory(sequelize)
const Status = StatusFactory(sequelize)
const Priority = PriorityFactory(sequelize)
const OtpCode = OtpCodeFactory(sequelize)

// Define associations
User.hasMany(Task, { foreignKey: 'userId' })
Task.belongsTo(User, { foreignKey: 'userId' })

Status.hasMany(Task, { foreignKey: 'statusId' })
Task.belongsTo(Status, { foreignKey: 'statusId' })

Priority.hasMany(Task, { foreignKey: 'priorityId' })
Task.belongsTo(Priority, { foreignKey: 'priorityId' })

User.hasMany(OtpCode, { foreignKey: 'userId' })
OtpCode.belongsTo(User, { foreignKey: 'userId' })

export { User, Task, Status, Priority, OtpCode }
