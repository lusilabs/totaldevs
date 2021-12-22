
export default function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const DAYS_MAP = {
  month: 'meses',
  daily: 'días',
  year: 'año'
}

export function FREQUENCY_MAP (price = {}) {
  let str
  if (price.type === 'recurring') {
    str = ' / ' + price.recurring.interval_count + ' ' + DAYS_MAP[price.recurring.interval]
  } else {
    str = ''
  }
  return str
}
