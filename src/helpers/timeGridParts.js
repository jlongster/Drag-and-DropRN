import dayjs from 'dayjs'
import { once } from 'lodash'

const startDay = dayjs().startOf('day')

export const oneDayInMinutes = 24 * 60
export const timeGridMinutesPart = 15
export const timeGridHeight = 40
export const minuteHeight = timeGridHeight / timeGridMinutesPart

const timeGridParts = () => {
  const gridParts = []

  for (let minuteDiff = 0; minuteDiff < oneDayInMinutes; minuteDiff += timeGridMinutesPart) {
    gridParts.push(startDay.add(minuteDiff, 'minute').format('HH:mm'))
  }

  return gridParts
}

export default once(timeGridParts)
