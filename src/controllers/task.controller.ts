import { Request, Response } from 'express'
import { Priority, Status, Task, User } from '../models/schemas'
import session from 'express-session'
import { User as UserSchema } from '~/models/schemas/user.schema'
import { Task as TaskSchema } from '~/models/schemas/task.schema'
import taskSchema from '~/models/schemas/task.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import { AddTaskReqBody } from '~/models/request/task.requests'

interface CustomSession extends session.Session {
  user?: UserSchema
}

export const getAllTasksController = async (req: Request, res: Response) => {
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

export const addTaskController = async (req: Request<ParamsDictionary, any, AddTaskReqBody>, res: Response) => {
  try {
    const userId = (req.session as CustomSession).user?.userId

    if (!userId) {
      return res.redirect('/auth/login')
    }
    const { title, description, dueDate, statusId, priorityId } = req.body

    const newTask = new TaskSchema({
      userId,
      title,
      description,
      dueDate,
      statusId,
      priorityId
    })
    await newTask.save()
    res.status(201).json({ message: 'Task created successfully', task: newTask })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}
