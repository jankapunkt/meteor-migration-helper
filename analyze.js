import { newLine } from './pattern'

export const asyncLine = /Promise.asyncApply\(/

// scans a function body for the above pattern
// to detect async functions
export const analyze = ({ name, fn, location, type }) => {
  if (fn.__asyncChecked) {
    return // skipping already checked methods
  }

  const source = fn.toString()
  const lines = source.split(newLine)
  fn.__asyncChecked = true

  if (lines[0] === '[options.name](args) {') {
    // skip validated methods as we use a mixin
    // for checking the run function
    return
  }

  const line = lines.length > 1
    ? lines[1] // cover multi-liner
    : lines[0] // cover one-liner
  const isAsync = asyncLine.test(line)

  if (!isAsync) {
    console.warn(`Deprecated (${type}): ${name} is not async, consider migrating now.`)
    console.warn('  =>', location)
  }
}
