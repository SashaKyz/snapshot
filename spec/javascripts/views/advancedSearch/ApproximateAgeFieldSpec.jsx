import React from 'react'
import {shallow} from 'enzyme'
import ApproximateAgeField from 'views/advancedSearch/ApproximateAgeField'

describe('ApproximateAgeField', () => {
  it('renders a radio button for age unit months', () => {
    const approximateAgeField = shallow(<ApproximateAgeField />)
    const radio = approximateAgeField.find({value: 'months', name: 'age-unit-months'})
    expect(radio.exists()).toEqual(true)
  })
  it('renders a radio button for age unit years', () => {
    const approximateAgeField = shallow(<ApproximateAgeField />)
    const radio = approximateAgeField.find({value: 'years', name: 'age-unit-years'})
    expect(radio.exists()).toEqual(true)
  })
  it('changes selected to months when months radio button is pressed', () => {
    const approximateAgeField = shallow(<ApproximateAgeField />)
    const radio = approximateAgeField.find({value: 'months', name: 'age-unit-months'})
    expect(approximateAgeField.prop('selected')).toEqual(undefined)
    radio.simulate('change', {target: {value: 'months'}})
    expect(approximateAgeField.state('selected')).toEqual('months')
  })
  it('changes selected to years when years radio button is pressed', () => {
    const approximateAgeField = shallow(<ApproximateAgeField />)
    const radio = approximateAgeField.find({value: 'years', name: 'age-unit-years'})
    expect(approximateAgeField.prop('selected')).toEqual(undefined)
    radio.simulate('change', {target: {value: 'years'}})
    expect(approximateAgeField.state('selected')).toEqual('years')
  })
  it('renders ApproximateAgeSelect and passes in selected value', () => {
    const approximateAgeField = shallow(<ApproximateAgeField />)
    const radio = approximateAgeField.find({value: 'years', name: 'age-unit-years'})
    const approximateAgeSelect = approximateAgeField.find('ApproximateAgeSelect')
    expect(approximateAgeField.prop('selected')).toEqual(undefined)
    expect(approximateAgeSelect.prop('selected')).toEqual(undefined)
    radio.simulate('change', {target: {value: 'years'}})
    const approximateSelect = approximateAgeField.update().find('ApproximateAgeSelect')
    expect(approximateSelect.prop('selected')).toEqual('years')
  })
})
