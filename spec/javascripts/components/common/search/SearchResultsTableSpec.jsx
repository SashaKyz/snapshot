import React from 'react'
import SearchResultsTable from 'common/search/SearchResultsTable'
import {mount} from 'enzyme'
import ReactTooltip from 'react-tooltip'
import * as Analytics from 'utils/analytics'

const defaultMockedResults = [
  {
    'gender': 'female',
    'caseStatus': 'Closed',
    'spCounty': 'pokhara',
    'spPhone': '111-111-1111',
    'isSealed': true,
    'akaFullName': ' (AKA: Laure)',
    'legacyDescriptor': {
      'legacy_id': '6j6DKYI0Ki',
    },
    'address': {
      'city': 'Lake Elsinore',
      'state': 'CA',
      'zip': '92530',
      'streetAddress': '4451 Anniversary Parkway',
      'type': 'Home',
    },
    'phoneNumber': {
      'number': '(923) 000-9928',
      'type': 'Home',
    },
    'dateOfBirth': '2005-01-03',
    'fullName': '<em>Sarah Timson',
  },
  {
    'gender': 'female',
    'spCounty': 'pokhara',
    'spPhone': '111-111-1111',
    'isSensitive': true,
    'isApproximateAge': 'Y',
    'clientCounties': [
      'Los Angeles',
    ],
    'address': null,
    'phoneNumber': null,
    'dateOfBirth': '1994-10-01',
    'fullName': 'c2 Bimson',
  },
  {
    'gender': 'unknown',
    'spCounty': 'pokhara',
    'spPhone': '111-111-1111',
    'address': {
      'city': 'King City',
      'state': 'CA',
      'zip': '95662',
      'streetAddress': '456 Anhalt Terrace',
      'type': 'Home',
    },
    'phoneNumber': {
      'number': '(923) 000-9928',
      'type': 'Home',
    },
    'dateOfBirth': '1999-02-17',
    'fullName': 'Sally Mae Dibson',
  },
  {
    'gender': 'male',
    'spCounty': 'pokhara',
    'spPhone': '111-111-1111',
    'address': null,
    'phoneNumber': null,
    'dateOfBirth': '1994-05-14',
    'fullName': 'Simon Donativo',
  },
  {
    'gender': 'male',
    'spCounty': 'pokhara',
    'spPhone': '111-111-1111',
    'address': {
      'city': 'town',
      'state': 'CA',
      'zip': null,
      'streetAddress': '123 4th',
      'type': 'Placement Home',
    },
    'phoneNumber': null,
    'dateOfBirth': '1983-01-01',
    'fullName': 'First Gimson',
  },
  {
    'gender': 'male',
    'spCounty': 'pokhara',
    'spPhone': '111-111-1111',
    'address': {
      'city': 'town',
      'state': 'CA',
      'zip': null,
      'streetAddress': '123 4th',
      'type': 'Placement Home',
    },
    'phoneNumber': null,
    'dateOfBirth': '1983-01-01',
    'fullName': 'Second Gimson',
  },
]

const render = (
  {
    results = [],
    personSearchFields = {},
    total = 1,
    onAuthorize = () => {},
    staffId = 'staffId',
    county = 'county',
  } = {}) => {
  return mount(
    <SearchResultsTable
      results={results}
      personSearchFields={personSearchFields}
      total={total}
      onAuthorize={onAuthorize}
      staffId={staffId}
      county={county}
    />, {disableLifecycleMethods: true})
}

describe('SearchResultsTable', () => {
  let component
  beforeEach(() => {
    component = render({results: defaultMockedResults})
  })

  describe('layout', () => {
    it('renders a AlertMessageResultsLimit component and sets total', () => {
      const totalResults = 251
      const component = render({total: totalResults})
      const alertMessage = component.find('AlertMessageResultsLimit')
      expect(alertMessage.exists()).toBe(true)
      expect(alertMessage.props().total).toBe(totalResults)
    })

    it('renders a InfoMessage component when total is 0', () => {
      const totalResults = 0
      const component = render({total: 0})
      const infoMessage = component.find('InfoMessage')
      expect(infoMessage.exists()).toBe(true)
      expect(infoMessage.props().total).toBe(totalResults)
    })

    describe('ReactTable', () => {
      it('renders a table', () => {
        const table = component.find('ReactTable')
        expect(table.exists()).toBe(true)
      })

      it('doesnot render a table when total is 0', () => {
        const table = render({total: 0}).find('ReactTable')
        expect(table.exists()).toBe(false)
      })

      it('renders the table headers', () => {
        const header = component.find('div.rt-resizable-header-content')
        expect(header.at(0).text()).toEqual('')
        expect(header.at(1).text()).toEqual('Name')
        expect(header.at(2).find('span').at(0).text()).toEqual('Date of Birth')
        expect(header.at(3).text()).toEqual('Sex at Birth')
        expect(header.at(4).text()).toEqual('Address')
        expect(header.at(5).text()).toEqual('Case Status')
        expect(header.at(6).find('span').at(0).text()).toEqual('County')
        expect(header.at(7).text()).toEqual("Staff Person's Phone")
      })

      it('renders the correct number of rows', () => {
        const rows = component.find('div.rt-tr-group')
        expect(rows.length).toEqual(defaultMockedResults.length)
      })

      it('renders the table data', () => {
        const row = component.find('div.rt-tr-group').at(0)
        const cell = row.find('div.rt-td')
        expect(cell.at(0).text()).toEqual('1.')
        expect(cell.at(1).find('button').text()).toEqual('Sarah Timson')
        expect(cell.at(1).find('span').at(1).text()).toEqual(' (AKA: Laure)')
        expect(cell.at(2).text()).toEqual('01/03/2005')
        expect(cell.at(3).text()).toEqual('Female')
        expect(cell.at(4).text()).toEqual('4451 Anniversary Parkway, Lake Elsinore, CA 92530')
        expect(cell.at(5).text()).toEqual('Closed')
        expect(cell.at(6).text()).toEqual('pokhara')
        expect(cell.at(7).text()).toEqual('(111) 111-1111')
        expect(cell.at(7).find('div').at(1).props()['x-ms-format-detection']).toEqual('none')
      })

      it('renders Approximate Dob', () => {
        const row = component.find('div.rt-tr-group').at(1)
        const cell = row.find('div.rt-td')
        expect(cell.at(2).text()).toEqual('~10/01/1994')
      })
    })
  })

  describe('Sealed', () => {
    it('renders Link', () => {
      const row = component.find('div.rt-tr-group').at(0)
      const cell = row.find('div.rt-td')
      expect(cell.find('button').exists()).toBe(true)
    })

    it('render client with tooltip', () => {
      const row = component.find('div.rt-tr-group').at(0)
      const cell = row.find('div.rt-td')
      expect(cell.find('span').at(0).html()).toContain('Sealed')
      expect(cell.find('span').at(0).find('i').props().className)
        .toBe('fa fa-eye-slash search-information-flag')
      expect(cell.find('span i').exists()).toBe(true)
    })

    it('rebuilds the tooltip when navigating', () => {
      const rebuild = spyOn(ReactTooltip, 'rebuild')
      const component = render({results: defaultMockedResults})
      const table = component.find('ReactTable')
      table.props().onPageChange()
      expect(rebuild).toHaveBeenCalled()
    })
  })

  describe('Sensitive', () => {
    it('render client with tooltip', () => {
      const row = component.find('div.rt-tr-group').at(1)
      const cell = row.find('div.rt-td')
      expect(cell.find('span').at(0).html()).toContain('Sensitive')
      expect(cell.find('span').at(0).find('i').props().className)
        .toBe('fa fa-shield search-information-flag')
      expect(cell.find('span i').exists()).toBe(true)
    })
  })

  describe('onClick', () => {
    it('calls onAuthorize with id', () => {
      const onAuthorize = jasmine.createSpy('onClick')
      const wrapper = render({results: defaultMockedResults, onAuthorize})
      const row = wrapper.find('div.rt-tr-group').at(0)
      const cell = row.find('div.rt-td').at(1)
      cell.find('button').props().onClick()
      expect(onAuthorize).toHaveBeenCalledWith('6j6DKYI0Ki')
    })

    it('logs searchResultClick event', () => {
      spyOn(Analytics, 'logEvent')
      const wrapper = render({results: defaultMockedResults})
      const row = wrapper.find('div.rt-tr-group').at(0)
      const cell = row.find('div.rt-td').at(1)
      cell.find('button').props().onClick()
      expect(Analytics.logEvent).toHaveBeenCalledWith('searchResultClick', {staffId: 'staffId', staff_county: 'county'})
    })
  })
})
