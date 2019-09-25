import {takeLatest, put, call, select} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {get} from 'utils/http'
import {logEvent} from 'utils/analytics'
import {PEOPLE_SEARCH_FETCH, fetchSuccess, fetchFailure} from 'actions/peopleSearchActions'
import {getStaffIdSelector, getCountyNameSelector} from 'selectors/userInfoSelectors'
import {selectSearchResultsCurrentRow} from 'selectors/peopleSearchSelectors'
import {toAPIParams, lowerCaseFieldValues} from 'data/personSearch'

const removeFalsy = (params) => {
  const newObj = {}
  Object.keys(params).forEach((prop) => {
    if (params[prop]) { newObj[prop] = params[prop] }
  })
  return newObj
}

const personSearchParams = (personSearchFields) => {
  if (!personSearchFields) { return {} }
  return {person_search_fields: lowerCaseFieldValues(removeFalsy(toAPIParams(personSearchFields)))}
}

const searchAfterParams = (sort) => (sort ? {search_after: sort} : {})

export function getPeopleEffect({isClientOnly, isAdvancedSearchOn, personSearchFields, size, totalResultsReceived, sort}) {
  const requestPayload = {
    is_client_only: isClientOnly,
    is_advanced_search_on: isAdvancedSearchOn,
    size: size,
    total_results_received: totalResultsReceived,
    ...personSearchParams(personSearchFields),
    ...searchAfterParams(sort),
  }
  return call(get, '/api/v1/people', requestPayload)
}

export function* fetchPeopleSearch({payload: {isClientOnly, isAdvancedSearchOn, personSearchFields, totalResultsReceived}}) {
  try {
    const TIME_TO_DEBOUNCE = 400
    yield call(delay, TIME_TO_DEBOUNCE)
    const size = yield select(selectSearchResultsCurrentRow)
    const response = yield getPeopleEffect({isClientOnly, isAdvancedSearchOn, personSearchFields, size, totalResultsReceived})
    const staffId = yield select(getStaffIdSelector)
    const county = yield select(getCountyNameSelector)
    yield put(fetchSuccess(response))
    yield call(logEvent, 'personSearch', {
      staffId: staffId,
      totalResults: response.hits.total,
      county: county,
    })
  } catch (error) {
    yield put(fetchFailure(error))
  }
}

export function* fetchPeopleSearchSaga() {
  yield takeLatest(PEOPLE_SEARCH_FETCH, fetchPeopleSearch)
}
