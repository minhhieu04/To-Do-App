import { Request, Response } from 'express'
import { Priority, Status, Task, User } from '../models/schemas'
import session from 'express-session'
import { User as UserSchema } from '~/models/schemas/user.schema'
import { set } from 'lodash'

interface CustomSession extends session.Session {
  user?: UserSchema
}

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as CustomSession).user?.userId

    if (!userId) {
      return res.redirect('/auth/login')
    }

    // get all tasks
    const tasks = await Task.findAll({
      where: { userId },
      include: [
        { model: Status, attributes: ['name'] },
        { model: Priority, attributes: ['name'] }
      ]
    })
    // if (!tasks || tasks.length === 0) {
    //   return res.render('tasks/dashboard', { tasks })
    // }

    res.render('tasks/dashboard', { userName: (req.session as CustomSession).user?.name || 'Superman', tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}
