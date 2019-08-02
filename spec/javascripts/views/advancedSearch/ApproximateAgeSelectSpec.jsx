import React from 'react'
import {shallow} from 'enzyme'
import {Field} from 'formik'
import ApproximateAgeSelect from 'views/advancedSearch/ApproximateAgeSelect'

describe('ApproximateAgeSelect', () => {
  it('renders an option select with 1 to 24 values when months is selected', () => {
    const approximateAgeSelect = shallow(<ApproximateAgeSelect selected='months' />)
    const field = approximateAgeSelect.find(Field)
    const options = field.find('option')
    const oneToTwentyFour = Array(24).fill().map((_, index) => `${index + 1}`)
    expect(options.map(option => option.text())).toEqual([
      '',
      ...oneToTwentyFour,
    ])
  })

  it('renders an option select with 1 to 120 values when years is selected', () => {
    const approximateAgeSelect = shallow(<ApproximateAgeSelect selected='years' />)
    const field = approximateAgeSelect.find(Field)
    const options = field.find('option')
    const oneToOneHundredTwenty = Array(120).fill().map((_, index) => `${index + 1}`)
    expect(options.map(option => option.text())).toEqual([
      '',
      ...oneToOneHundredTwenty,
    ])
  })

  it('renders empty option when nothing is selected', () => {
    const approximateAgeSelect = shallow(<ApproximateAgeSelect selected={undefined} />)
    const field = approximateAgeSelect.find(Field)
    const options = field.find('option')
    expect(options.map(option => option.text())).toEqual([
      '',
    ])
  })
})
