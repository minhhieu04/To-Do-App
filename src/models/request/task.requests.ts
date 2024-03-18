export interface AddTaskReqBody {
  title: string
  description: string
  dueDate: Date
  statusId: number
  priorityId: number
}

export interface EditTaskReqBody extends AddTaskReqBody {}

export interface Pagination {
  page?: number
  alphabetFilter?: string
  sortColumn?: string
  sortOrder?: 'ASC' | 'DESC'
  statusFilter?: number
  priorityFilter?: number
}
