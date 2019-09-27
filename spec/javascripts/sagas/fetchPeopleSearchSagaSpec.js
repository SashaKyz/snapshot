import {takeLatest, put, call, select} from 'redux-saga/effects'
import {get} from 'utils/http'
import {delay} from 'redux-saga'
import {logEvent} from 'utils/analytics'
import {fetchPeopleSearchSaga, fetchPeopleSearch, getPeopleEffect} from 'sagas/fetchPeopleSearchSaga'
import {PEOPLE_SEARCH_FETCH, search, fetchSuccess, fetchFailure} from 'actions/peopleSearchActions'
import {getStaffIdSelector, getCountyNameSelector} from 'selectors/userInfoSelectors'
import {selectSearchResultsCurrentRow} from 'selectors/peopleSearchSelectors'

describe('fetchPeopleSearchSaga', () => {
  it('fetches people search results on PEOPLE_SEARCH_FETCH', () => {
    const peopleSeachSagaGenerator = fetchPeopleSearchSaga()
    expect(peopleSeachSagaGenerator.next().value).toEqual(takeLatest(PEOPLE_SEARCH_FETCH, fetchPeopleSearch))
  })
})

describe('fetchPeopleSearch', () => {
  const isClientOnly = true
  const isAdvancedSearchOn = true
  const personSearchFields = {lastName: 'Doe'}
  const totalResultsReceived = 250
  const action = search(isClientOnly, isAdvancedSearchOn, personSearchFields, totalResultsReceived)

  it('finds some error during the process', () => {
    const error = 'Something went wrong'
    const size = 25
    const peopleSearchGenerator = fetchPeopleSearch(action)
    const searchParams = {
      is_client_only: true,
      is_advanced_search_on: true,
      total_results_received: totalResultsReceived,
      person_search_fields: {
        last_name: 'doe',
      },
      size: size,
    }
    expect(peopleSearchGenerator.next().value).toEqual(call(delay, 400))
    expect(peopleSearchGenerator.next().value).toEqual(
      select(selectSearchResultsCurrentRow)
    )
    expect(peopleSearchGenerator.next(size).value).toEqual(call(get, '/api/v1/people', searchParams))
    expect(peopleSearchGenerator.throw(error).value).toEqual(put(fetchFailure('Something went wrong')))
  })

  it('fetches people search results successfully', () => {
    const staff_id = '0x4'
    const size = 25
    const county = 'Sacramento'
    const searchResults = {
      hits: {
        total: 0,
        hits: [],
      },
    }
    const peopleSearchGenerator = fetchPeopleSearch(action)
    const searchParams = {
      is_client_only: true,
      is_advanced_search_on: true,
      total_results_received: totalResultsReceived,
      person_search_fields: {
        last_name: 'doe',
      },
      size: size,
    }
    expect(peopleSearchGenerator.next().value).toEqual(call(delay, 400))
    expect(peopleSearchGenerator.next(size).value).toEqual(
      select(selectSearchResultsCurrentRow)
    )
    expect(peopleSearchGenerator.next(size).value).toEqual(call(get, '/api/v1/people', searchParams))
    expect(peopleSearchGenerator.next(searchResults).value).toEqual(
      select(getStaffIdSelector)
    )
    expect(peopleSearchGenerator.next(staff_id).value).toEqual(
      select(getCountyNameSelector)
    )
    expect(peopleSearchGenerator.next(county).value).toEqual(put(fetchSuccess(searchResults)))
    expect(peopleSearchGenerator.next().value).toEqual(call(logEvent, 'personSearch', {
      staffId: staff_id,
      totalResults: searchResults.hits.total,
      staff_county: county,
    }))
  })
})

describe('getPeopleEffect', () => {
  it('is a call effect to the people search endpoint', () => {
    expect(getPeopleEffect({
      isClientOnly: true,
      isAdvancedSearchOn: true,
      totalResultsReceived: 250,
      personSearchFields: {firstName: 'John', county: 'Yolo'},
      size: 25,
    })).toEqual(call(get, '/api/v1/people', {
      is_client_only: true,
      is_advanced_search_on: true,
      total_results_received: 250,
      person_search_fields: {first_name: 'john', county: 'yolo'},
      size: 25,
    }))
  })
  it('includes search_after param when present', () => {
    expect(getPeopleEffect({
      isClientOnly: true,
      isAdvancedSearchOn: false,
      totalResultsReceived: 100,
      personSearchFields: {firstName: 'John', lastName: 'Doe', county: 'Yolo'},
      size: 25,
      sort: 'What even goes here?',
    })).toEqual(call(get, '/api/v1/people', {
      is_client_only: true,
      is_advanced_search_on: false,
      total_results_received: 100,
      size: 25,
      person_search_fields: {first_name: 'john', last_name: 'doe', county: 'yolo'},
      search_after: 'What even goes here?',
    }))
  })
})
