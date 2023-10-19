import { analyze } from './analyze'
import { getLocation } from './getLocation'

export const checkAsyncMixin = options => {
  const { name, run } = options
  const location = getLocation(7)

  analyze({
    name,
    location,
    type: 'ValidatedMethod',
    fn: run
  })

  options.run.__asyncChecked = true
  return options
}
