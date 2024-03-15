import { Router } from 'express'
import {
  getAllTasksController,
  addTaskController,
  getTaskController,
  editTaskController,
  deleteTaskController
} from '~/controllers/task.controller'

const taskRoutes = Router()

taskRoutes.get('/', getAllTasksController)
taskRoutes.get('/:taskId', getTaskController)
taskRoutes.post('/add-task', addTaskController)
taskRoutes.put('/:taskId', editTaskController)
taskRoutes.delete('/:taskId', deleteTaskController)

export default taskRoutes
