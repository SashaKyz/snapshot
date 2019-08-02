import React from 'react'
import {shallow} from 'enzyme'
import SearchByAgeWrapper from 'views/advancedSearch/formikWrappers/SearchByAgeWrapper'

const render = ({field: {onChange, value, name}, onSearchByAge} = {field: {onChange: () => true, value: '', name: ''}, onSearchByAge: () => true}) =>
  shallow(<SearchByAgeWrapper field={{onChange, value}} onSearchByAge={onSearchByAge} />)

describe('SearchByAgeWrapper', () => {
  it('renders a select field with empty string, dob, and approximate values', () => {
    const searchByAgeWrapper = render()
    const options = searchByAgeWrapper.find('option')
    expect(options.map(option => option.text())).toEqual([
      '',
      'Date of Birth',
      'Approximate Age',
    ])
  })

  it('calls onSearchByAge and onChange callback on change', () => {
    const onChange = jasmine.createSpy('onchange')
    const onSearchByAge = jasmine.createSpy('onSearchByAge')
    const searchByAgeWrapper = render({field: {onChange}, onSearchByAge})
    searchByAgeWrapper.simulate('change')
    expect(onSearchByAge).toHaveBeenCalledWith(undefined, onChange)
  })
})
