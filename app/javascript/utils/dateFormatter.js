import _ from 'lodash'
import moment from 'moment-timezone'

export function dateFormatter(date) {
  if (_.isEmpty(date)) {
    return ''
  } else {
    return moment(date, 'YYYY-MM-DD').format('MM/DD/YYYY')
  }
}

export function dateTimeFormatter(date) {
  if (_.isEmpty(date)) {
    return ''
  } else {
    return moment(date, 'YYYY-MM-DDTh:mm:ss.fffZ').tz('America/Los_Angeles').format('MM/DD/YYYY h:mm A')
  }
}

export function dateRangeFormatter({start_date, end_date}) {
  return [
    dateFormatter(start_date),
    dateFormatter(end_date),
  ].filter((dateString) => Boolean(dateString))
    .join(' - ') || 'No Date'
}

const dateFormats = [
  'MM/DD/YYYY',
  'M/DD/YYYY',
  'MM/D/YYYY',
  'M/D/YYYY',
  'M-DD-YYYY',
  'MM-DD-YYYY',
  'M-D-YYYY',
  'MM-D-YYYY',
  'MMDDYYYY',
]

export function isValidDate(date) {
  return moment(date, dateFormats, true).isValid()
}

export function dateFormatToYYYYMMDD(date) {
  return moment.tz(date, [...dateFormats], 'America/Los_Angeles').local().format('YYYY-MM-DD')
}
