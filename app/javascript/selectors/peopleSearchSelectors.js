import {List, Map} from 'immutable'
import {
  selectCounties,
  systemCodeDisplayValue,
} from 'selectors/systemCodeSelectors'
import {
  mapLanguages,
  mapIsSensitive,
  mapIsSealed,
  mapIsProbationYouth,
  mapRaces,
  mapEthnicities,
  mapAddress,
  mapPhoneNumber,
} from 'utils/peopleSearchHelper'
import {isCommaSuffix, formatHighlightedSuffix} from 'utils/nameFormatter'
import {phoneNumberFormatter} from 'utils/phoneNumberFormatter'
import Fuse from 'fuse.js'
import {getClientIdErrors} from 'utils/clientIdValidator'
import {getSSNErrors} from 'utils/ssnValidator'
import {isFutureDatetimeCreate, combineCompact} from 'utils/validator'

const LAST_NAME_MIN_SEARCHABLE_CHARS = 1
const CLIENT_ID_MIN_SEARCHABLE_CHARS = 19
const SSN_MIN_SEARCHABLE_CHARS = 9

const selectPeopleSearch = state => {
  return state.get('peopleSearch')
}
export const selectSearchTermValue = state =>
  selectPeopleSearch(state).getIn(['searchFields', 'searchTerm'])
export const selectResultsTotalValue = state =>
  selectPeopleSearch(state).get('total')
export const selectCheckSearchResults = state =>
  selectPeopleSearch(state).get('checkSearchResults')
export const selectLoadingStatus = state =>
  selectPeopleSearch(state).get('isFetching')
export const selectLastResultsSortValue = state => {
  const lastResult = selectPeopleSearch(state)
    .get('results')
    .last()
  return lastResult.get('sort').toJS()
}

const formatSSN = ssn => ssn && ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3')
const formatDOB = (dob, highlight) =>
  highlight ? '<em>'.concat(dob, '</em>') : dob
const formatPhoneNumber = phoneNumber =>
  phoneNumber ?
    Map({
      number: phoneNumberFormatter(phoneNumber.get('number')),
      type: phoneNumber.get('type'),
    }) :
    null

// Try to find a match from a list of highlights by stripping out <em> tags
const highlightNameField = (exactName, highlights) =>
  highlights.find(
    highlight => highlight.replace(/<(\/)?em>/g, '') === exactName
  )

const maybeHighlightedField = (result, highlight, key) =>
  highlight.getIn(
    [key, 0],
    highlightNameField(
      result.get(key),
      highlight.get('autocomplete_search_bar', List())
    )
  )

const combineFullName = (
  firstName,
  middleName,
  lastName,
  nameSuffix,
  isCommaSuffix
) => {
  const nameStem = [firstName, middleName, lastName].filter(Boolean).join(' ')

  if (nameSuffix) {
    return `${nameStem}${isCommaSuffix ? ',' : ''} ${nameSuffix}`
  }

  return nameStem
}

const formatFullName = (result, highlight) =>
  combineFullName(
    maybeHighlightedField(result, highlight, 'first_name') ||
    result.get('first_name'),
    maybeHighlightedField(result, highlight, 'middle_name') ||
    result.get('middle_name'),
    maybeHighlightedField(result, highlight, 'last_name') ||
    result.get('last_name'),
    formatHighlightedSuffix(
      maybeHighlightedField(result, highlight, 'name_suffix') ||
      result.get('name_suffix')
    ),
    isCommaSuffix(result.get('name_suffix'))
  )

const mapCounties = (counties, countyCodes) =>
  counties.map(county => systemCodeDisplayValue(county.get('id'), countyCodes))

const hasActiveCsec = _result => false

export const selectAkaFullName = (state, result) => {
  const akas = result.get('akas', List()).toJS()
  const searchTerm = selectSearchTermValue(state)
  const options = {
    threshold: 0.7,
    keys: ['first_name', 'last_name', 'middle_name'],
  }
  const fuse = new Fuse(akas, options)
  const aka = fuse.search(searchTerm)[0]
  if (!aka) {
    return null
  }
  return ` (${aka.name_type || ''}: ${aka.first_name || ''} ${aka.last_name ||
    ''})`
}

const peopleResults = (state, result, highlight) => {
  return {
    akaFullName: selectAkaFullName(state, result),
    legacy_id: result.get('id'),
    fullName: formatFullName(result, highlight),
    legacyDescriptor: result.get('legacy_descriptor'),
    gender: result.get('gender'),
    caseStatus: result.get('case_status'),
    spCounty: result.get('sp_county'),
    spPhone: result.get('sp_phone'),
    isApproximateAge: result.get('estimated_dob_code'),
    languages: mapLanguages(state, result),
    races: mapRaces(state, result),
    ethnicity: mapEthnicities(state, result),
    dateOfBirth: formatDOB(result.get('date_of_birth'), highlight.has('searchable_date_of_birth')),
    isDeceased: Boolean(result.get('date_of_death')),
    isCsec: hasActiveCsec(result),
    ssn: formatSSN(maybeHighlightedField(result, highlight, 'ssn') || result.get('ssn')),
    clientCounties: mapCounties(result.get('client_counties', List()), selectCounties(state)),
    address: mapAddress(state, result),
    phoneNumber: formatPhoneNumber(mapPhoneNumber(result).first()),
    isSensitive: mapIsSensitive(result),
    isSealed: mapIsSealed(result),
    isProbationYouth: mapIsProbationYouth(result),
  }
}

export const selectPeopleResults = (state) => selectPeopleSearch(state)
  .get('results')
  .map((fullResult) => {
    const result = fullResult.get('_source', Map())
    const highlight = fullResult.get('highlight', Map())
    return Map(peopleResults(state, result, highlight))
  })

export const selectSearchResultsCurrentRow = (state) => selectPeopleSearch(state).get('searchTableCurrentRow')

export const selectSearchResultsSubset = (state) => {
  const results = selectPeopleResults(state)
  const currentPageNumber = selectPeopleSearch(state).get('searchTableCurrentPage')
  const currentRowNumber = selectPeopleSearch(state).get('searchTableCurrentRow')
  const startResultIndex = (currentPageNumber - 1) * currentRowNumber
  const endResultsIndex = currentPageNumber * currentRowNumber
  const resultsSubset = results.toJS().slice(startResultIndex, endResultsIndex)
  return resultsSubset
}

export const selectStartTime = state =>
  selectPeopleSearch(state).get('startTime')

export const selectPersonCreatedAtTime = state =>
  state
    .get('relationshipsQueryCycleTime')
    .toJS()
    .map(t => t.personCreatedAtTime)
    .pop()

export const selectClientIdErrors = (state) => {
  const errorCheckFields = selectPeopleSearch(state).get('errorCheckFields')
  const errorCheck = errorCheckFields.get('clientId')
  const searchFields = selectPeopleSearch(state).get('searchFields')
  const clientId = searchFields.get('clientId') || ''
  const clientIdWithoutHyphens = clientId.replace(/-|_/g, '')
  return errorCheck ? getClientIdErrors(clientIdWithoutHyphens) : []
}

export const selectSsnErrors = (state) => {
  const errorCheckFields = selectPeopleSearch(state).get('errorCheckFields')
  const errorCheck = errorCheckFields.get('ssn')
  const searchFields = selectPeopleSearch(state).get('searchFields')
  const ssn = searchFields.get('ssn')
  const ssnWithoutHyphens = ssn.replace(/-|_/g, '')
  return errorCheck ? getSSNErrors(ssnWithoutHyphens) : []
}

export const selectDobErrors = (state) => {
  const searchFields = selectPeopleSearch(state).get('searchFields')
  const dob = searchFields.get('dateOfBirth') || ''
  console.log('dob is ' + dob)
  return combineCompact(isFutureDatetimeCreate(dob, 'Please enter date as today or earlier.'))
}

export const selectPersonSearchFields = state =>
  selectPeopleSearch(state).get('searchFields').toJS()

const isSearchable = (value, min) => {
  if (min === LAST_NAME_MIN_SEARCHABLE_CHARS) {
    return value && value.length >= min
  }
  return value && value.replace(/-|_/g, '').length === min
}

let emptyCheckForLastName
let emptyCheckForClientId
let emptyCheckForSsn
let emptyCheckForFields = true

const isEmptyCheckForLastName = (searchableLastName) => {
  if (searchableLastName === '') {
    emptyCheckForLastName = true
  } else {
    emptyCheckForLastName = false
  }
}

const isEmptyCheckForClientId = (searchableClientId) => {
  if (searchableClientId === '') {
    emptyCheckForClientId = true
  } else {
    emptyCheckForClientId = false
  }
}

const isEmptyCheckForSsn = (searchableSsn) => {
  if (searchableSsn === '') {
    emptyCheckForSsn = true
  } else {
    emptyCheckForSsn = false
  }
}

const isEmptyCheckForFields = (lastName, clientId, ssn, dateOfBirth) => {
  if (lastName === '' && clientId === '' && ssn === '' && dateOfBirth === '') {
    emptyCheckForFields = false
  } else {
    emptyCheckForFields = true
  }
}

const canSearchable = (searchableLastName, searchableClientId, searchableSsn, dobErrors, ssnErrors) => {
  const isSearchableLastName = emptyCheckForLastName || searchableLastName
  const isSearchableClientId = emptyCheckForClientId || searchableClientId
  const isSearchableSsn = emptyCheckForSsn || searchableSsn
  const isSearchableDobErrors = dobErrors.length === 0
  const isSearchableSsnErrors = ssnErrors.length === 0
  const isSearchable = emptyCheckForFields && isSearchableLastName &&
    isSearchableClientId && isSearchableSsn && isSearchableDobErrors &&
    isSearchableSsnErrors
  return isSearchable
}

export const selectCanSearch = (state) => {
  const {lastName, clientId, ssn, dateOfBirth} = selectPersonSearchFields(state)
  const searchableLastName = isSearchable(lastName, LAST_NAME_MIN_SEARCHABLE_CHARS)
  const searchableClientId = isSearchable(clientId, CLIENT_ID_MIN_SEARCHABLE_CHARS)
  const searchableSsn = isSearchable(ssn, SSN_MIN_SEARCHABLE_CHARS)
  const dobErrors = selectDobErrors(state)
  const ssnErrors = selectSsnErrors(state)
  isEmptyCheckForFields(lastName, clientId, ssn, dateOfBirth)
  isEmptyCheckForLastName(searchableLastName)
  isEmptyCheckForClientId(searchableClientId)
  isEmptyCheckForSsn(searchableSsn)
  return canSearchable(searchableLastName, searchableClientId, searchableSsn, dobErrors, ssnErrors)
}
