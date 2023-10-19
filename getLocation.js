// return the current location
// of function execution, considering
// multiple levels of wrappers
import { newLine, whiteSpace } from './pattern'

export const getLocation = (level = 3) => {
  const e = new Error('')
  const lines = e.stack.split(newLine)
  return lines[level].replace(whiteSpace, ' ').trim()
}
