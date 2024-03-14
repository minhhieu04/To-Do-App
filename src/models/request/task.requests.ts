export interface AddTaskReqBody {
  title: string
  description: string
  dueDate: Date
  statusId: number
  priorityId: number
}
