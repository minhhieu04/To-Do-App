export interface AddTaskReqBody {
  title: string
  description: string
  dueDate: Date
  statusId: number
  priorityId: number
}

export interface EditTaskReqBody extends AddTaskReqBody {}

export interface Pagination {
  page: string
}
