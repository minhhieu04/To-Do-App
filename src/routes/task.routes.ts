import { Router } from 'express'
import { getAllTasks } from '~/controllers/task.controller'

const taskRoutes = Router()

taskRoutes.get('/', getAllTasks)

export default taskRoutes
