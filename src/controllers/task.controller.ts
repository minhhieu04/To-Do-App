import { Request, Response } from 'express'
import { Priority, Status, Task, User } from '../models/schemas'
import session from 'express-session'
import { User as UserSchema } from '~/models/schemas/user.schema'
import { Task as TaskSchema } from '~/models/schemas/task.schema'
import { ParamsDictionary } from 'express-serve-static-core'
import { AddTaskReqBody, EditTaskReqBody, Pagination } from '~/models/request/task.requests'
import { calculateOffsetAndLimit } from '~/utils/caculations'
import { Op, OrderItem } from 'sequelize'

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

    const page = req.query.page ? req.query.page : 1
    const alphabetFilter = req.query.alphabetFilter ? (req.query.alphabetFilter as string).toUpperCase() : null
    const sortColumn = req.query.sortColumn || 'dueDate'
    const sortOrder = req.query.sortOrder || 'ASC'
    const statusFilter = req.query.statusFilter || null
    const priorityFilter = req.query.priorityFilter || null

    const { offset, limit } = calculateOffsetAndLimit(page, PAGE_SIZE)

    // Tạo một mảng chứa điều kiện lọc theo bảng chữ cái
    const titleFilter = alphabetFilter ? { title: { [Op.like]: `${alphabetFilter}%` } } : {}
    const descriptionFilter = alphabetFilter ? { description: { [Op.like]: `${alphabetFilter}%` } } : {}

    // Tạo một mảng chứa điều kiện lọc theo trạng thái
    const statusCondition = statusFilter ? { statusId: statusFilter } : {}

    // Tạo một mảng chứa điều kiện lọc theo mức độ ưu tiên
    const priorityCondition = priorityFilter ? { priorityId: priorityFilter } : {}

    // Tạo một đối tượng chứa điều kiện sắp xếp
    let orderCondition: [string, string][] = []
    if (sortColumn === 'dueDate') {
      orderCondition = [['dueDate', sortOrder]]
    } else if (sortColumn === 'status') {
      orderCondition = [['statusId', sortOrder]]
    } else if (sortColumn === 'priority') {
      orderCondition = [['priorityId', sortOrder]]
    } else {
      // Default order by title if sortColumn is not recognized
      orderCondition = [['title', sortOrder]]
    }

    // Lọc theo bảng chữ cái trong cột title và description
    const tasks = await Task.findAll({
      where: { userId, ...titleFilter, ...descriptionFilter, ...statusCondition, ...priorityCondition }, // Gộp các điều kiện lọc
      include: [
        { model: Status, attributes: ['name'] },
        { model: Priority, attributes: ['name'] }
      ],
      order: orderCondition, // Sắp xếp theo điều kiện
      offset,
      limit
    })

    // Tính toán số trang và gửi dữ liệu đến view
    const totalTasks: number = await Task.count({
      where: { userId, ...titleFilter, ...descriptionFilter, ...statusCondition, ...priorityCondition }
    })
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

export const filterTasksController = async (req: Request, res: Response) => {
  try {
    const userId = (req.session as CustomSession).user?.userId

    if (!userId) {
      return res.redirect('/auth/login')
    }

    const { sortBy, sortOrder, dateFilter, statusFilter, priorityFilter } = req.query

    const queryOptions: any = {
      where: { userId },
      include: [
        { model: Status, attributes: ['name'] },
        { model: Priority, attributes: ['name'] }
      ]
    }

    // Xử lý sắp xếp
    if (sortBy && sortOrder) {
      queryOptions.order = [[sortBy, sortOrder]] // Sắp xếp theo trường `sortBy` với `sortOrder`
    }

    // Xử lý lọc theo ngày
    if (dateFilter) {
      if (dateFilter === 'newest') {
        queryOptions.order = [['createdAt', 'DESC']]
      } else if (dateFilter === 'oldest') {
        queryOptions.order = [['createdAt', 'ASC']]
      }
    }

    // Xử lý lọc theo trạng thái
    if (statusFilter) {
      queryOptions.include.push({
        model: Status,
        where: { name: statusFilter }
      })
    }

    // Xử lý lọc theo mức độ ưu tiên
    if (priorityFilter) {
      queryOptions.include.push({
        model: Priority,
        where: { name: priorityFilter }
      })
    }

    // Lấy danh sách task dựa trên các điều kiện đã xử lý
    const tasks = await Task.findAll(queryOptions)

    res.render('tasks/dashboard', {
      userName: (req.session as CustomSession).user?.name || 'Superman',
      tasks
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).render('error', { message: 'Internal server error' })
  }
}
