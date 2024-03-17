export const calculateOffsetAndLimit = (page: number, pageSize: number): { offset: number; limit: number } => {
  const offset = (page - 1) * pageSize
  const limit = pageSize
  return { offset, limit }
}
