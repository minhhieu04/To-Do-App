import { Router } from 'express'
import {
  getAllTasksController,
  addTaskController,
  getTaskController,
  editTaskController
} from '~/controllers/task.controller'

const taskRoutes = Router()

taskRoutes.get('/', getAllTasksController)
taskRoutes.get('/:taskId', getTaskController)
taskRoutes.post('/add-task', addTaskController)
taskRoutes.put('/:taskId', editTaskController)

export default taskRoutes
