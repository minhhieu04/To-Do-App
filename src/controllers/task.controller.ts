import { Request, Response } from 'express'
import { Priority, Status, Task, User } from '../models/schemas'
import session from 'express-session'
import { User as UserSchema } from '~/models/schemas/user.schema'
import { Task as TaskSchema } from '~/models/schemas/task.schema'
import taskSchema from '~/models/schemas/task.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import { AddTaskReqBody, EditTaskReqBody, Pagination } from '~/models/request/task.requests'
import { calculateOffsetAndLimit } from '~/utils/caculations'

interface CustomSession extends session.Session {
  user?: UserSchema
}

const PAGE_SIZE = 6

export const getAllTasksController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  try {
    const userId = (req.session as CustomSession).user?.userId

    if (!userId) {
      return res.redirect('/auth/login')
    }

    const page = req.query.page ? parseInt(req.query.page as string) : 1

    const { offset, limit } = calculateOffsetAndLimit(page, PAGE_SIZE)
    // get all tasks
    const tasks = await Task.findAll({
      where: { userId },
      include: [
        { model: Status, attributes: ['name'] },
        { model: Priority, attributes: ['name'] }
      ],
      offset,
      limit
    })

    // calculate the number of pages
    const totalTasks: number = await Task.count({ where: { userId } })
    const totalPages = Math.ceil(totalTasks / PAGE_SIZE)

    res.render('tasks/dashboard', {
      userName: (req.session as CustomSession).user?.name || 'Superman',
      tasks,
      totalPages,
      currentPage: page
    })
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

export const getTaskController = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const task = await Task.findByPk(taskId, {
      include: [
        { model: Status, attributes: ['name'] },
        { model: Priority, attributes: ['name'] }
      ]
    })
    res.status(200).json({ task: task })
  } catch (error) {
    console.error('Error get task:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}

export const editTaskController = async (req: Request<ParamsDictionary, any, EditTaskReqBody>, res: Response) => {
  try {
    const { taskId } = req.params
    const { title, description, dueDate, statusId, priorityId } = req.body
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' })
    }
    const task = await Task.findByPk(taskId)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }

    task.title = title || task.title
    task.description = description || task.description
    task.dueDate = dueDate || task.dueDate
    task.statusId = statusId || task.statusId
    task.priorityId = priorityId || task.priorityId

    await task.save()
    res.status(200).json({ message: 'Task updated successfully', task })
  } catch (error) {
    console.error('Error edit task:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params
    const userId = (req.session as CustomSession).user?.userId

    const taskToDelete = await Task.findByPk(taskId)

    if (!taskToDelete) {
      return res.status(404).json({ message: 'Task not found' })
    }

    // Check if the task belongs to the current user
    if (taskToDelete.userId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this task' })
    }

    await taskToDelete.destroy()

    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error delete task:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}
