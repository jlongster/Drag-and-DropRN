import dayjs from 'dayjs'
import { once } from 'lodash'

const days = () => {
  const firstDay = dayjs().subtract(14, 'day')
  const daysArray = []
  for (let dayIndex = 0; dayIndex < 25; dayIndex++) {
    daysArray.push(firstDay.add(dayIndex, 'day').format('DD.MMMM dddd'))
  }

  return daysArray
}

export default once(days)
