export const generateCode = (length: number, type: 'string' | 'number'): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  if (type === 'string') {
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  } else if (type === 'number') {
    const min = Math.pow(10, length - 1)
    const max = Math.pow(10, length) - 1
    result += Math.floor(Math.random() * (max - min + 1)) + min
    return result
  } else {
    throw new Error('Invalid type. Type must be either "string" or "number".')
  }
}
