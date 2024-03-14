import { Router } from 'express'
import { getAllTasksController, addTaskController } from '~/controllers/task.controller'

const taskRoutes = Router()

taskRoutes.get('/', getAllTasksController)
taskRoutes.post('/add-task', addTaskController)

export default taskRoutes
