import React from 'react'
import {shallow} from 'enzyme'
import PersonSearchResults from 'common/search/PersonSearchResults'
import {SHOW_MODE} from 'actions/screeningPageActions'
import SearchResultsTable from 'common/search/SearchResultsTable'

const render = ({
  total = 0,
  results = [],
  personSearchFields = {},
  onAuthorize = () => {},
  isSearchResults = true,
  staffId = 'staffId',
  county = 'county',
} = {}) => (
  shallow(
    <PersonSearchResults
      total={total}
      results={results}
      personSearchFields={personSearchFields}
      onAuthorize={onAuthorize}
      isSearchResults={isSearchResults}
      staffId={staffId}
      county={county}
    />, {disableLifecycleMethods: true})
)

describe('PersonSearchResults', () => {
  describe('layout', () => {
    it('renders a CardView', () => {
      const component = render({})
      const cardView = component.find('CardView')
      expect(cardView.exists()).toEqual(true)
    })

    it('sets props on the CardView', () => {
      const onAuthorize = () => {}
      const staffId = 'staffId'
      const county = 'county'
      const componentProps = {
        total: 200,
        onAuthorize,
        staffId,
        county,
      }
      const component = render(componentProps)
      const cardView = component.find('CardView')
      const props = cardView.props()
      const tableProps = {
        results: [],
        total: 200,
        personSearchFields: {},
        onAuthorize,
        staffId,
        county,
      }
      const table = (<SearchResultsTable {...tableProps} />)
      expect(props.id).toEqual('person-search-results-card')
      expect(props.title).toEqual('Search Results (200 records found)')
      expect(props.mode).toEqual(SHOW_MODE)
      expect(props.show).toEqual(table)
    })

    describe('CardView title', () => {
      describe('when the total results is undefined', () => {
        it('sets the title with 0 results', () => {
          const component = render({total: undefined})
          const cardView = component.find('CardView')
          const title = cardView.props().title
          expect(title).toEqual('Search Results (0 records found)')
        })
      })

      describe('when the total results is 250 or less', () => {
        it('sets the title with the number of results', () => {
          const component = render({total: 250})
          const cardView = component.find('CardView')
          const title = cardView.props().title
          expect(title).toEqual('Search Results (250 records found)')
        })
      })

      describe('when the total results is 251 or greater', () => {
        it('sets the title with 250+ instead of the number of results', () => {
          const component = render({total: 251})
          const cardView = component.find('CardView')
          const title = cardView.props().title
          expect(title).toEqual('Search Results (250+ records found)')
        })
      })
    })
  })
})
