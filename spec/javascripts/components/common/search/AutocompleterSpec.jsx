import Autocompleter from 'common/search/Autocompleter'
import React from 'react'
import Autocomplete from 'react-autocomplete'
import {shallow, mount} from 'enzyme'
import * as Analytics from 'utils/analytics'
import moment from 'moment'

const defaultPersonSearchFields = {
  searchTerm: '',
  address: '',
  approximateAge: '',
  approximateAgeUnits: '',
  searchByAgeMethod: '',
  city: '',
  clientId: '',
  country: '',
  county: '',
  dateOfBirth: '',
  firstName: '',
  sexAtBirth: '',
  lastName: '',
  middleName: '',
  ssn: '',
  state: '',
  suffix: '',
  zipCode: '',
}

describe('<Autocompleter />', () => {
  function mountAutocompleter({
    canCreateNewPerson = true,
    id = null,
    isSelectable = () => true,
    onBlur = () => null,
    onCancel = () => null,
    onChange = () => null,
    onClear = () => null,
    onFocus = () => null,
    onLoadMoreResults = () => null,
    onSearch = () => null,
    onSelect = () => null,
    personSearchFields = defaultPersonSearchFields,
    results = [],
    staffId = '0x3',
    total = 0,
    states = [],
    counties = [],
    isAdvancedSearchOn = false,
    dobErrors = [],
    ssnErrors = [],
    canSearch = false,
    onKeyPress = () => null,
    onKeyUp = () => null,
  }) {
    return mount(
      <Autocompleter
        canCreateNewPerson={canCreateNewPerson}
        id={id}
        isSelectable={isSelectable}
        onBlur={onBlur}
        onCancel={onCancel}
        onChange={onChange}
        onClear={onClear}
        onFocus={onFocus}
        onLoadMoreResults={onLoadMoreResults}
        onSearch={onSearch}
        onSelect={onSelect}
        personSearchFields={personSearchFields}
        results={results}
        staffId={staffId}
        startTime="2018-08-01T16:42:59.674Z"
        total={total}
        states={states}
        counties={counties}
        isAdvancedSearchOn={isAdvancedSearchOn}
        dobErrors={dobErrors}
        ssnErrors={ssnErrors}
        canSearch={canSearch}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
      />
    )
  }
  function renderAutocompleter({
    id = null,
    isSelectable = () => true,
    onBlur = () => null,
    onCancel = () => null,
    onChange = () => null,
    onClear = () => null,
    onFocus = () => null,
    onLoadMoreResults = () => null,
    onSearch = () => null,
    onSelect = () => null,
    personSearchFields = defaultPersonSearchFields,
    results = [],
    staffId = '0x3',
    total = 0,
    states = [],
    counties = [],
    isAdvancedSearchOn = false,
    dobErrors = [],
    ssnErrors = [],
    canSearch = false,
    onKeyPress = () => null,
    onKeyUp = () => null,
  }) {
    return shallow(
      <Autocompleter
        id={id}
        isSelectable={isSelectable}
        onBlur={onBlur}
        onCancel={onCancel}
        onChange={onChange}
        onClear={onClear}
        onFocus={onFocus}
        onLoadMoreResults={onLoadMoreResults}
        onSearch={onSearch}
        onSelect={onSelect}
        personSearchFields={personSearchFields}
        results={results}
        staffId={staffId}
        startTime="2018-08-01T16:42:59.674Z"
        total={total}
        states={states}
        counties={counties}
        isAdvancedSearchOn={isAdvancedSearchOn}
        dobErrors={dobErrors}
        ssnErrors={ssnErrors}
        canSearch={canSearch}
        onKeyPress={onKeyPress}
        onKeyUp={onKeyUp}
      />,
      {disableLifecycleMethods: true}
    )
  }

  beforeEach(() => {
    spyOn(Analytics, 'logEvent')
  })

  describe('#onItemSelect', () => {
    let onLoadMoreResults
    let onSelect
    let total
    const results = [
      {legacyDescriptor: {legacy_id: 1}},
      {legacyDescriptor: {legacy_id: 2}},
      {legacyDescriptor: {legacy_id: 3}},
    ]
    const item = results[0]

    beforeEach(() => {
      onSelect = jasmine.createSpy('onSelect')
      onLoadMoreResults = jasmine.createSpy('onLoadMoreResults')
    })

    describe('when an item is selectable', () => {
      let autocompleter
      beforeEach(() => {
        autocompleter = mountAutocompleter({
          results,
          onSelect,
        })
        autocompleter.setState({menuVisible: true})
        autocompleter
          .find('div[id="search-result-1-of-3"]')
          .first()
          .simulate('click', null)
      })

      it('calls onSelect with the selected result', () => {
        expect(onSelect).toHaveBeenCalledWith(item)
      })

      it('does not hide the menu', () => {
        const header = autocompleter.find('SuggestionHeader')
        expect(header.length).toBe(1)
      })

      it('logs a search result event', () => {
        expect(Analytics.logEvent).toHaveBeenCalledWith('searchResultClick', {
          searchIndex: 0,
          staffId: '0x3',
          startTime: moment('2018-08-01T16:42:59.674Z').valueOf(),
        })
      })
    })

    describe('when an item is selectable and is create new person', () => {
      let autocompleter
      beforeEach(() => {
        autocompleter = mountAutocompleter({
          results,
          onSelect,
        })
        autocompleter.setState({menuVisible: true})
        autocompleter
          .find('div[id="search-result-create-new-of-the-same"]')
          .first()
          .simulate('click', null)
      })

      it('calls onSelect with the selected result', () => {
        expect(onSelect).toHaveBeenCalled()
      })

      it('does not hide the menu', () => {
        const header = autocompleter.find('SuggestionHeader')
        expect(header.length).toBe(1)
      })
    })

    describe('when an item is selectable and is show more results', () => {
      describe(', and canCreateNewPerson and canLoadMoreResults is true', () => {
        let autocompleter
        total = 11
        beforeEach(() => {
          autocompleter = mountAutocompleter({
            results,
            onSelect,
            onLoadMoreResults,
            total,
          })
          autocompleter.setState({menuVisible: true})
          autocompleter
            .find('div[id="search-result-show-more-of-the-same"]')
            .first()
            .simulate('click', null)
        })

        it('calls onLoadMoreResults', () => {
          expect(onLoadMoreResults).toHaveBeenCalled()
        })

        it('contain className col-md-6', () => {
          expect(
            autocompleter
              .find('div[id="search-result-show-more-of-the-same"]')
              .props().className
          ).toContain('col-md-6')
          expect(
            autocompleter
              .find('div[id="search-result-create-new-of-the-same"]')
              .props().className
          ).toContain('col-md-6')
        })
      })

      describe(', and canCreateNewPerson and canLoadMoreResults is false', () => {
        let autocompleter
        const canCreateNewPerson = false
        beforeEach(() => {
          autocompleter = mountAutocompleter({
            results,
            onSelect,
            onLoadMoreResults,
            canCreateNewPerson,
          })
          autocompleter.setState({menuVisible: true})
        })
        it('doesnot contain className col-md-6', () => {
          expect(
            autocompleter
              .find('div[id="search-result-create-new-of-the-same"]')
              .exists()
          ).toBe(false)
          expect(
            autocompleter
              .find('div[id="search-result-show-more-of-the-same"]')
              .exists()
          ).toBe(false)
        })
      })

      describe(', and canCreateNewPerson is true and canLoadMoreResults is false', () => {
        let autocompleter
        const canCreateNewPerson = true
        beforeEach(() => {
          autocompleter = mountAutocompleter({
            results,
            onSelect,
            onLoadMoreResults,
            canCreateNewPerson,
          })
          autocompleter.setState({menuVisible: true})
        })
        it('doesnot contain className col-md-6', () => {
          expect(
            autocompleter
              .find('div[id="search-result-create-new-of-the-same"]')
              .props().className
          ).not.toContain('col-md-6')
          expect(
            autocompleter
              .find('div[id="search-result-show-more-of-the-same"]')
              .exists()
          ).toBe(false)
        })
      })

      describe('isAdvancedSearchOn feature toggle is On', () => {
        const totalResultsReceived = results.length
        const pageSize = 25

        it('calls onLoadMoreResults', () => {
          const autocompleter = mountAutocompleter({
            results,
            onSelect,
            onLoadMoreResults,
            total,
            isAdvancedSearchOn: true,
            dobErrors: [],
          })
          const currentPageNumber = autocompleter.state().currentPageNumber
          const nextPageNumber = currentPageNumber + 1
          const totalResultsRequested = pageSize * nextPageNumber
          autocompleter
            .find('Autocomplete')
            .props()
            .onSelect('_value', {showMoreResults: true})
          expect(onLoadMoreResults).toHaveBeenCalledWith(true, defaultPersonSearchFields, totalResultsReceived, totalResultsRequested)
        })

        it('calls onLoadMoreResults with an address', () => {
          const personSearchFields = {
            ssn: '',
            clientId: '',
            state: '',
            county: 'Colusa',
            city: 'Central City',
            address: 'Star Labs',
            approximateAgeUnits: '',
          }
          const autocompleter = mountAutocompleter({
            results,
            onSelect,
            onLoadMoreResults,
            total,
            personSearchFields,
            isAdvancedSearchOn: true,
          })
          const currentPageNumber = autocompleter.state().currentPageNumber
          const nextPageNumber = currentPageNumber + 1
          const totalResultsRequested = pageSize * nextPageNumber
          autocompleter
            .find('Autocomplete')
            .props()
            .onSelect('_value', {showMoreResults: true})
          expect(onLoadMoreResults).toHaveBeenCalledWith(true, personSearchFields, totalResultsReceived, totalResultsRequested)
        })
      })
    })

    it('logs a search result event when a deeper item is clicked', () => {
      const autocompleter = mountAutocompleter({
        results,
        onSelect,
      })
      autocompleter.setState({menuVisible: true})
      autocompleter
        .find('div[id="search-result-3-of-3"]')
        .first()
        .simulate('click', null)

      expect(Analytics.logEvent).toHaveBeenCalledWith('searchResultClick', {
        searchIndex: 2,
        staffId: '0x3',
        startTime: moment('2018-08-01T16:42:59.674Z').valueOf(),
      })
    })

    describe('when an item is not selectable', () => {
      beforeEach(() => {
        spyOn(window, 'alert')
        const isSelectable = jasmine
          .createSpy('isSelectable')
          .and.returnValue(false)
        const autocompleter = mountAutocompleter({
          results,
          onSelect,
          isSelectable,
          onLoadMoreResults,
        })
        autocompleter.setState({menuVisible: true})
        autocompleter
          .find('div[id="search-result-1-of-3"]')
          .first()
          .simulate('click', null)
      })

      it('only presents error message', () => {
        expect(onSelect).not.toHaveBeenCalled()
        expect(window.alert).toHaveBeenCalledWith(
          'You are not authorized to add this person.'
        )
        expect(onLoadMoreResults).not.toHaveBeenCalled()
      })
    })
  })

  describe('onChangeInput', () => {
    let searchInput
    let onSearch
    let onChange
    beforeEach(() => {
      onSearch = jasmine.createSpy('onSearch')
      onChange = jasmine.createSpy('onChange')
      searchInput = renderAutocompleter({onSearch, onChange})
        .find('Autocomplete')
        .dive()
        .find('input')
    })
    describe('when user types two non whitespace characters', () => {
      const value = 'aa'
      beforeEach(() => searchInput.simulate('change', {target: {value}}))

      it('performs a search', () => {
        expect(onSearch).toHaveBeenCalledWith(false, {searchTerm: value})
      })

      it('calls props onChange', () => {
        expect(onChange).toHaveBeenCalledWith('searchTerm', value)
      })
    })
    describe('when search value contains a character then a whitespace', () => {
      const value = 'a '
      beforeEach(() => searchInput.simulate('change', {target: {value}}))

      it('performs a search', () => {
        expect(onSearch).toHaveBeenCalledWith(false, {searchTerm: value})
      })

      it('calls props onChange', () => {
        expect(onChange).toHaveBeenCalledWith('searchTerm', value)
      })
    })
    describe('when search value contains two whitespace characters', () => {
      const value = '  '
      beforeEach(() => searchInput.simulate('change', {target: {value}}))

      it('does not perform a search', () => {
        expect(onSearch).not.toHaveBeenCalled()
      })

      it('calls props onChange', () => {
        expect(onChange).toHaveBeenCalledWith('searchTerm', value)
      })
    })
    describe('when search value contains a whitespace then a character', () => {
      const value = ' a'
      beforeEach(() => searchInput.simulate('change', {target: {value}}))

      it('does not perform a search', () => {
        expect(onSearch).not.toHaveBeenCalled()
      })

      it('calls props onChange', () => {
        expect(onChange).toHaveBeenCalledWith('searchTerm', value)
      })
    })
    describe('when isAdvancedSearchOn flag is on', () => {
      it('does not perform a search', () => {
        const isAdvancedSearchOn = true
        const value = 'Girish'
        const searchInput = renderAutocompleter({onSearch, onChange, isAdvancedSearchOn})
          .find('Autocomplete')
          .dive()
          .find('input')
        searchInput.simulate('change', {target: {value}})

        expect(onSearch).not.toHaveBeenCalled()
      })
    })
  })

  describe('onKeyPress', () => {
    let onSearch
    let onChange

    beforeEach(() => {
      onSearch = jasmine.createSpy('onSearch')
      onChange = jasmine.createSpy('onChange')
    })

    it('trigger search when canSearch is true', () => {
      const autocompleter = renderAutocompleter({
        onChange,
        onSearch,
        isAdvancedSearchOn: true,
        canSearch: true,
        personSearchFields: {
          lastName: 'Sandiego',
        },
        results: [
          {person: 'one'},
          {person: 'two'},
        ],
      })
      const personSearchFields = autocompleter.find('PersonSearchFields')
      personSearchFields.simulate('keypress', {charCode: 13})
      expect(onSearch).toHaveBeenCalledWith(true, {lastName: 'Sandiego'}, 2)
    })

    it('doesnot search when canSearch is false', () => {
      const autocompleter = renderAutocompleter({
        onChange,
        onSearch,
        isAdvancedSearchOn: true,
        canSearch: false,
        personSearchFields: {
          lastName: 'Sandiego',
        },
      })
      const personSearchFields = autocompleter.find('PersonSearchFields')
      personSearchFields.simulate('keypress', {charCode: 13})
      expect(onSearch).not.toHaveBeenCalled()
    })
  })

  describe('onKeyUp', () => {
    let onSearch
    let onChange

    beforeEach(() => {
      onSearch = jasmine.createSpy('onSearch')
      onChange = jasmine.createSpy('onChange')
    })

    it('trigger search when canSearch is true and dob is valid ', () => {
      const autocompleter = renderAutocompleter({
        onChange,
        onSearch,
        isAdvancedSearchOn: true,
        canSearch: true,
        personSearchFields: {
          dateOfBirth: '2018-11-11',
        },
        results: [
          {person: 'one'},
          {person: 'two'},
        ],
      })
      const personSearchFields = autocompleter.find('PersonSearchFields')
      personSearchFields.props().onKeyUp({target: {value: '11/11/2018'}})
      expect(onChange).toHaveBeenCalledWith('dateOfBirth', '2018-11-11')
      personSearchFields.simulate('keypress', {charCode: 13})
      expect(onSearch).toHaveBeenCalledWith(true, {dateOfBirth: '2018-11-11'}, 2)
    })

    it('calls onChange when dob is empty', () => {
      const autocompleter = renderAutocompleter({
        onChange,
        onSearch,
        isAdvancedSearchOn: true,
        canSearch: true,
        personSearchFields: {
          dateOfBirth: '2018-11-11',
        },
        results: [
          {person: 'one'},
          {person: 'two'},
        ],
      })
      const personSearchFields = autocompleter.find('PersonSearchFields')
      personSearchFields.props().onKeyUp({target: {value: ''}})
      expect(onChange).toHaveBeenCalledWith('dateOfBirth', '')
    })

    it('calls onChange when dob is null', () => {
      const autocompleter = renderAutocompleter({
        onChange,
        onSearch,
        isAdvancedSearchOn: true,
        canSearch: true,
        personSearchFields: {
          dateOfBirth: null,
        },
        results: [
          {person: 'one'},
          {person: 'two'},
        ],
      })
      const personSearchFields = autocompleter.find('PersonSearchFields')
      personSearchFields.props().onKeyUp({target: {value: null}})
      expect(onChange).toHaveBeenCalledWith('dateOfBirth', '')
    })

    it('calls onChange when dob is undefined', () => {
      const autocompleter = renderAutocompleter({
        onChange,
        onSearch,
        isAdvancedSearchOn: true,
        canSearch: true,
        personSearchFields: {
          dateOfBirth: undefined,
        },
        results: [
          {person: 'one'},
          {person: 'two'},
        ],
      })
      const personSearchFields = autocompleter.find('PersonSearchFields')
      personSearchFields.props().onKeyUp({target: {value: undefined}})
      expect(onChange).toHaveBeenCalledWith('dateOfBirth', '')
    })
  })

  describe('handleSubmit', () => {
    let onClear
    let onSearch
    let onChange

    beforeEach(() => {
      onClear = jasmine.createSpy('onClear')
      onSearch = jasmine.createSpy('onSearch')
      onChange = jasmine.createSpy('onChange')
    })

    it('searches when button is submitted', () => {
      const autocompleter = renderAutocompleter({
        onChange,
        onSearch,
        isAdvancedSearchOn: true,
        personSearchFields: {
          lastName: 'Sandiego',
          firstName: 'Carmen',
          suffix: 'Jr',
          address: '123 Main St',
          city: 'Woodland',
          county: 'Yolo',
          approximateAge: '24',
          approximateAgeUnits: 'months',
        },
        results: [
          {person: 'one'},
          {person: 'two'},
        ],
      })
      const personSearchFields = autocompleter.find('PersonSearchFields')
      personSearchFields.props().onSubmit()
      expect(onSearch).toHaveBeenCalledWith(true, {
        lastName: 'Sandiego',
        firstName: 'Carmen',
        suffix: 'Jr',
        address: '123 Main St',
        city: 'Woodland',
        county: 'Yolo',
        approximateAge: '24',
        approximateAgeUnits: 'months',
      }, 2)
    })

    describe('sets the search term', () => {
      describe('search by age method is', () => {
        describe('date of birth', () => {
          it('sets the search term with date of birth', () => {
            const autocompleter = renderAutocompleter({
              onChange,
              onSearch,
              isAdvancedSearchOn: true,
              personSearchFields: {
                lastName: 'Sandiego',
                firstName: 'Carmen',
                suffix: 'Jr',
                searchByAgeMethod: 'dob',
                dateOfBirth: '1985/09/09',
                approximateAge: '120',
                approximateAgeUnits: 'years',
              },
            })
            const personSearchFields = autocompleter.find('PersonSearchFields')
            personSearchFields.props().onSubmit()
            expect(onChange).toHaveBeenCalledWith('searchTerm', 'Carmen Sandiego, Jr 1985/09/09')
          })
        })
        describe('approximate age', () => {
          it('sets the search term with approximate age and units', () => {
            const autocompleter = renderAutocompleter({
              onChange,
              onSearch,
              isAdvancedSearchOn: true,
              personSearchFields: {
                lastName: 'Sandiego',
                firstName: 'Carmen',
                suffix: 'Jr',
                searchByAgeMethod: 'approximate',
                dateOfBirth: '1985/09/09',
                approximateAge: '120',
                approximateAgeUnits: 'years',
              },
            })
            const personSearchFields = autocompleter.find('PersonSearchFields')
            personSearchFields.props().onSubmit()
            expect(onChange).toHaveBeenCalledWith('searchTerm', 'Carmen Sandiego, Jr 120 years')
          })
        })
      })
    })

    it('displays search results when button is submitted', () => {
      const autocompleter = renderAutocompleter({
        personSearchFields: {searchTerm: '', address: '123 Main St', city: 'Woodland', county: 'Sacramento'},
      })
      const personSearchFields = autocompleter.find('PersonSearchFields')
      expect(autocompleter.state().menuVisible).toEqual(false)
      personSearchFields.props().onSubmit()
      expect(autocompleter.state().menuVisible).toEqual(true)
    })

    it('clears old results when button is submitted', () => {
      const autocompleter = renderAutocompleter({
        onClear,
        personSearchFields: {searchTerm: '', address: '123 Main St', city: 'Woodland', county: 'Sacramento'},
      })
      const personSearchFields = autocompleter.find('PersonSearchFields')
      personSearchFields.props().onSubmit()
      expect(onClear).toHaveBeenCalledWith('results')
    })
  })

  describe('renderInput', () => {
    it('renders an input element', () => {
      const autocompleter = renderAutocompleter({})
      const input = shallow(
        autocompleter
          .find('Autocomplete')
          .props()
          .renderInput()
      )
      expect(input.name()).toEqual('input')
    })

    it('stores a ref of the input', () => {
      const autocompleter = mountAutocompleter({})
      const inputRef = autocompleter.instance().inputRef
      expect(inputRef).toBeDefined()
      expect(inputRef.tagName).toEqual('INPUT')
    })

    it('calls the ref callback that ReactAutocomplete provides', () => {
      const internalRef = spyOn(Autocomplete.prototype, 'exposeAPI')
      mountAutocompleter({})
      expect(internalRef).toHaveBeenCalled()
    })
  })

  describe('render', () => {
    it('displays an Autocomplete component', () => {
      const autocomplete = renderAutocompleter({
        id: 'search-input-id',
      }).find('Autocomplete')
      expect(autocomplete.length).toBe(1)

      const input = autocomplete.dive().find('input')
      expect(input.props().id).toEqual('search-input-id')
    })

    describe('autocomplete menu', () => {
      describe('is open', () => {
        it('when the menuVisible state is set to true', () => {
          const autocompleter = mountAutocompleter({})
          autocompleter.setState({menuVisible: true})
          const autocomplete = autocompleter.find('Autocomplete')
          expect(autocomplete.props().open).toEqual(true)
        })

        it('when there are results and searchTerm is searchable', () => {
          const results = [{legacyDescriptor: {legacy_id: 'some-other-legacy-id'}}]
          const personSearchFields = {searchTerm: 'go'}
          const autocompleter = mountAutocompleter({results, personSearchFields})
          const autocomplete = autocompleter.find('Autocomplete')
          expect(autocomplete.props().open).toEqual(true)
        })
      })

      describe('is closed', () => {
        it('when the menuVisible state is set to false', () => {
          const autocompleter = mountAutocompleter({})
          autocompleter.setState({menuVisible: false})
          const autocomplete = autocompleter.find('Autocomplete')
          expect(autocomplete.props().open).toEqual(false)
        })

        it('when there are results and search term is not searchable', () => {
          const results = [{legacyDescriptor: {legacy_id: 'some-other-legacy-id'}}]
          const personSearchFields = {searchTerm: 'g'}
          const autocompleter = mountAutocompleter({results, personSearchFields})
          const autocomplete = autocompleter.find('Autocomplete')
          expect(autocomplete.props().open).toEqual(false)
        })

        it('when there are no results and search term is searchable', () => {
          const personSearchFields = {searchTerm: 'go'}
          const autocompleter = mountAutocompleter({personSearchFields})
          const autocomplete = autocompleter.find('Autocomplete')
          expect(autocomplete.props().open).toEqual(false)
        })
      })
    })

    describe('with search results present', () => {
      const address = {id: 'test address'}
      const ethnicity = {id: 'test ethnicity'}
      const languages = ['test languages']
      const phoneNumber = {id: 'test phone number'}
      const races = ['test race']
      const legacyDescriptor = {legacy_id: 'some-legacy-id'}
      const results = [
        {
          address,
          dateOfBirth: 'test date of birth',
          isCsec: false,
          isDeceased: false,
          isProbationYouth: false,
          ethnicity,
          fullName: 'test full name',
          gender: 'male',
          isSealed: false,
          isSensitive: false,
          languages,
          legacyDescriptor,
          phoneNumber,
          races,
          ssn: 'test ssn',
        },
        {
          legacyDescriptor: {legacy_id: 'some-other-legacy-id'},
        },
      ]
      let autocompleter
      beforeEach(() => {
        autocompleter = mountAutocompleter({results})
        autocompleter.setState({menuVisible: true})
      })

      it('displays multiple suggestions', () => {
        const suggestions = autocompleter.find('PersonSuggestion')
        expect(suggestions.length).toEqual(2)
      })

      it('displays person suggestion', () => {
        const suggestions = autocompleter.find('PersonSuggestion')
        const suggestion = suggestions.at(0)

        expect(suggestion.props().address).toEqual(address)
        expect(suggestion.props().dateOfBirth).toEqual('test date of birth')
        expect(suggestion.props().isCsec).toEqual(false)
        expect(suggestion.props().isDeceased).toEqual(false)
        expect(suggestion.props().isProbationYouth).toEqual(false)
        expect(suggestion.props().ethnicity).toEqual(ethnicity)
        expect(suggestion.props().fullName).toEqual('test full name')
        expect(suggestion.props().gender).toEqual('male')
        expect(suggestion.props().isSealed).toEqual(false)
        expect(suggestion.props().isSensitive).toEqual(false)
        expect(suggestion.props().languages).toEqual(languages)
        expect(suggestion.props().legacyDescriptor).toEqual(legacyDescriptor)
        expect(suggestion.props().phoneNumber).toEqual(phoneNumber)
        expect(suggestion.props().races).toEqual(races)
        expect(suggestion.props().ssn).toEqual('test ssn')
      })

      it('changes className when highlighted', () => {
        const input = autocompleter.find('input').at(0)
        const resultBefore = autocompleter.find(
          'div[id="search-result-1-of-2"]'
        )
        expect(resultBefore.props().className).not.toEqual(
          'search-item highlighted-search-item'
        )

        input.simulate('keyDown', {key: 'ArrowDown', keyCode: 40, which: 40})
        input.simulate('keyDown', {key: 'ArrowDown', keyCode: 40, which: 40})
        const result = autocompleter.find('div[id="search-result-1-of-2"]')
        expect(result.props().className).toEqual(
          'search-item highlighted-search-item'
        )
      })

      it('when enter is pressed it should not highlight', () => {
        const input = autocompleter.find('input').at(0)
        input.simulate('keyDown', {key: 'Enter', keyCode: 13, which: 13})
        const result = autocompleter.find('div[id="search-result-1-of-2"]')
        expect(result.props().className).not.toEqual(
          'search-item highlighted-search-item'
        )
      })

      it('marks any highlighted item as activedescendant', () => {
        const renderItem = autocompleter.find('Autocomplete').props().renderItem

        const setSize = results.length
        let posInSet = 1
        renderItem(results[posInSet - 1], true)

        expect(
          autocompleter
            .instance()
            .inputRef.getAttribute('aria-activedescendant')
        ).toEqual(`search-result-${posInSet}-of-${setSize}`)

        posInSet = 2
        renderItem(results[posInSet - 1], true)

        expect(
          autocompleter
            .instance()
            .inputRef.getAttribute('aria-activedescendant')
        ).toEqual(`search-result-${posInSet}-of-${setSize}`)
      })
    })

    describe('suggestion header', () => {
      it('displays no results were found', () => {
        const autocompleter = mountAutocompleter({
          total: 0,
          personSearchFields: {searchTerm: 'Simpson', county: '', state: ''},
        })
        autocompleter.setState({menuVisible: true})
        const suggestionHeader = autocompleter.find('SuggestionHeader')
        expect(suggestionHeader.html()).toContain(
          'No results were found for "Simpson"'
        )
      })

      it('displays number of results found', () => {
        const tenResults = Array.from(Array(10).keys()).map(id => ({
          legacyDescriptor: {legacy_id: id},
        }))
        const autocompleter = mountAutocompleter({
          results: tenResults,
          total: 20,
          personSearchFields: {
            searchTerm: 'Simpson Jr 120 years',
            county: '',
            state: '',
          },
        })
        autocompleter.setState({menuVisible: true})
        const suggestionHeader = autocompleter.find('SuggestionHeader')
        expect(suggestionHeader.html()).toContain(
          'Showing 1-10 of 20 results for "Simpson Jr 120 years"'
        )
      })
    })
  })

  it('renders PersonSearchFields with personSearchFields', () => {
    const component = renderAutocompleter({})
    const personSearchFields = component.find('PersonSearchFields')
    expect(personSearchFields.exists()).toBe(true)
    expect(personSearchFields.props().personSearchFields).toEqual(defaultPersonSearchFields)
  })

  it('renders PersonSearchFields with selected county', () => {
    const component = renderAutocompleter({personSearchFields: {county: 'Yolo'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.county).toBe('Yolo')
  })

  it('renders PersonSearchFields with selected lastName', () => {
    const component = renderAutocompleter({personSearchFields: {lastName: 'Bravo'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.lastName).toBe('Bravo')
  })

  it('calls onChange when a new lastName is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('lastName', 'Bravo')
    expect(onChange).toHaveBeenCalledWith('lastName', 'Bravo')
  })

  it('renders PersonSearchFields with selected firstName', () => {
    const component = renderAutocompleter({personSearchFields: {firstName: 'Miguel'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.firstName).toBe('Miguel')
  })

  it('calls onChange when a new firstName is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('firstName', 'Miguel')
    expect(onChange).toHaveBeenCalledWith('firstName', 'Miguel')
  })

  it('renders PersonSearchFields with selected middleName', () => {
    const component = renderAutocompleter({personSearchFields: {middleName: 'Angel'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.middleName).toBe('Angel')
  })

  it('calls onChange when a new middleName is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('middleName', 'Angel')
    expect(onChange).toHaveBeenCalledWith('middleName', 'Angel')
  })

  it('renders PersonSearchFields with selected clientId', () => {
    const component = renderAutocompleter({personSearchFields: {clientId: '1'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.clientId).toBe('1')
  })

  it('calls onChange when a new clientId is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('clientId', '2')
    expect(onChange).toHaveBeenCalledWith('clientId', '2')
  })

  it('renders PersonSearchFields with selected suffix', () => {
    const component = renderAutocompleter({personSearchFields: {suffix: 'Jr'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.suffix).toBe('Jr')
  })

  it('calls onChange when new suffix is selected', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('suffix', 'Sr')
    expect(onChange).toHaveBeenCalledWith('suffix', 'Sr')
  })

  it('renders PersonSearchFields with selected ssn', () => {
    const component = renderAutocompleter({personSearchFields: {ssn: '111223333'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.ssn).toBe('111223333')
  })

  it('calls onChange when a new ssn is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('ssn', '222334444')
    expect(onChange).toHaveBeenCalledWith('ssn', '222334444')
  })

  it('renders PersonSearchFields with selected dateOfBirth', () => {
    const component = renderAutocompleter({personSearchFields: {dateOfBirth: '01/01/2000'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.dateOfBirth).toBe('01/01/2000')
  })

  it('calls onChange when new dateOfBirth is selected', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('dateOfBirth', '02/02/2001')
    expect(onChange).toHaveBeenCalledWith('dateOfBirth', '02/02/2001')
  })

  it('renders PersonSearchFields with selected age value', () => {
    const component = renderAutocompleter({personSearchFields: {approximateAge: '1'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.approximateAge).toBe('1')
  })

  it('calls onChange when a new age value is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('approximateAge', '2')
    expect(onChange).toHaveBeenCalledWith('approximateAge', '2')
  })

  it('renders PersonSearchFields with selected approximateAgeUnits', () => {
    const component = renderAutocompleter({personSearchFields: {approximateAgeUnits: 'Months'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.approximateAgeUnits).toBe('Months')
  })

  it('calls onChange when new approximateAgeUnits is selected', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('approximateAgeUnits', 'Years')
    expect(onChange).toHaveBeenCalledWith('approximateAgeUnits', 'Years')
  })

  it('renders PersonSearchFields with selected sex at birth', () => {
    const component = renderAutocompleter({personSearchFields: {sexAtBirth: 'Female'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.sexAtBirth).toBe('Female')
  })

  it('calls onChange when new sex at birth is selected', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('sexAtBirth', 'Male')
    expect(onChange).toHaveBeenCalledWith('sexAtBirth', 'Male')
  })

  it('renders PersonSearchFields with selected address', () => {
    const component = renderAutocompleter({personSearchFields: {address: 'Goodbye Road'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.address).toBe('Goodbye Road')
  })

  it('calls onChange when new address is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('address', 'Penny Lane')
    expect(onChange).toHaveBeenCalledWith('address', 'Penny Lane')
  })

  it('renders PersonSearchFields with selected city', () => {
    const component = renderAutocompleter({personSearchFields: {city: 'Emerald City'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.city).toBe('Emerald City')
  })

  it('calls onChange when new city is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('city', 'Woodland')
    expect(onChange).toHaveBeenCalledWith('city', 'Woodland')
  })

  it('renders PersonSearchFields with selected county', () => {
    const component = renderAutocompleter({personSearchFields: {county: 'Yolo'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.county).toBe('Yolo')
  })

  it('calls onChange when new county is selected', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('county', 'Yolo')
    expect(onChange).toHaveBeenCalledWith('county', 'Yolo')
  })

  it('renders PersonSearchFields with selected state', () => {
    const component = renderAutocompleter({personSearchFields: {state: 'California'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.state).toBe('California')
  })

  it('calls onChange when new state is selected', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('state', 'Nevada')
    expect(onChange).toHaveBeenCalledWith('state', 'Nevada')
  })

  it('renders PersonSearchFields with selected country', () => {
    const component = renderAutocompleter({personSearchFields: {country: 'United States'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.country).toBe('United States')
  })

  it('calls onChange when new country is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('country', 'Mexico')
    expect(onChange).toHaveBeenCalledWith('country', 'Mexico')
  })

  it('renders PersonSearchFields with selected zip code', () => {
    const component = renderAutocompleter({personSearchFields: {zipCode: '12345'}})
    expect(component.find('PersonSearchFields').props().personSearchFields.zipCode).toBe('12345')
  })

  it('calls onChange when new zip code is entered', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderAutocompleter({onChange})
    component.find('PersonSearchFields').props().onChange('zipCode', '54321')
    expect(onChange).toHaveBeenCalledWith('zipCode', '54321')
  })
})
