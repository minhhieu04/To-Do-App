import { Request, Response } from 'express'
import { Priority, Status, Task, User } from '../models/schemas'
import session from 'express-session'
import { User as UserSchema } from '~/models/schemas/user.schema'

interface CustomSession extends session.Session {
  user?: UserSchema
}

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as CustomSession).user?.userId || 13
    if (!userId) return res.status(400).json({ message: 'User not authenticated' })

    // get all tasks
    const tasks = await Task.findAll({
      where: { userId },
      include: [
        { model: Status, attributes: ['name'] },
        { model: Priority, attributes: ['name'] }
      ]
    })
    if (!tasks || tasks.length === 0) {
      return res.status(200).json({ message: 'No tasks found for this user' })
    }

    res.render('tasks/dashboard', { userName: (req.session as CustomSession).user?.name || 'Superman', tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}
