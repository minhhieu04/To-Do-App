import { Router } from 'express'
import {
  getAllTasksController,
  addTaskController,
  getTaskController,
  editTaskController,
  deleteTaskController
} from '~/controllers/task.controller'
import { checkLogin } from '~/middlewares/authentication'

const taskRoutes = Router()

taskRoutes.get('/', checkLogin, getAllTasksController)
taskRoutes.get('/:taskId', checkLogin, getTaskController)
taskRoutes.post('/add-task', checkLogin, addTaskController)
taskRoutes.put('/:taskId', checkLogin, editTaskController)
taskRoutes.delete('/:taskId', checkLogin, deleteTaskController)

export default taskRoutes
