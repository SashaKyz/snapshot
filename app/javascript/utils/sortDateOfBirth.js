const SORT_DOWN = 1
const SORT_UP = -1

export const sortDateOfBirth = (a, b, order) => {
  if (a.dateOfBirth === '' && b.dateOfBirth === '') {
    return 0
  }

  if (order === 'desc') {
    if (a.dateOfBirth === '') {
      return SORT_DOWN
    }
    if (b.dateOfBirth === '') {
      return SORT_UP
    }
  } else {
    if (a.dateOfBirth === '') {
      return SORT_UP
    }
    if (b.dateOfBirth === '') {
      return SORT_DOWN
    }
  }
  var aDOB = a.dateOfBirth
  var bDOB = b.dateOfBirth
  var dateObject1 = new Date(aDOB)
  var dateObject2 = new Date(bDOB)
  if (order === 'desc') {
    return dateObject2 - dateObject1
  } else {
    return dateObject1 - dateObject2
  }
}
