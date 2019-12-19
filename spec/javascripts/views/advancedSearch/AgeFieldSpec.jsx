import React from 'react'
import {shallow} from 'enzyme'
import {Field} from 'formik'
import AgeField from 'views/advancedSearch/AgeField'
import SearchByAgeWrapper from 'views/advancedSearch/formikWrappers/SearchByAgeWrapper'

describe('AgeField', () => {
  it('renders a field with SearchByAgeWrapper component', () => {
    const ageField = shallow(<AgeField/>)
    const searchByAgeField = ageField.find({name: 'searchByAgeMethod'})
    expect(searchByAgeField.prop('component')).toEqual(SearchByAgeWrapper)
  })

  it('renders DateOfBirthField if selected is dob', () => {
    const ageField = shallow(<AgeField/>)
    ageField.setState({selected: 'dob'})
    const dateOfBirthField = ageField.find('DateOfBirthField')
    expect(dateOfBirthField.exists()).toEqual(true)
  })

  it('renders ApproximateAgeField if selected is approximate', () => {
    const ageField = shallow(<AgeField/>)
    ageField.setState({selected: 'approximate'})
    const dateOfBirthField = ageField.find('ApproximateAgeField')
    expect(dateOfBirthField.exists()).toEqual(true)
  })

  it('renders empty div if selected is empty', () => {
    const ageField = shallow(<AgeField/>)
    ageField.setState({selected: ''})
    const dateOfBirthField = ageField.find('div.col-md-6')
    expect(dateOfBirthField.exists()).toEqual(true)
  })

  // these could be a feature test
  xit('clears dob when switching selected to empty', () => {
    const dob = '11/12/2012'
    const ageField = shallow(<AgeField/>)
    const dateOfBirthField = ageField.find('DateOfBirthField')
    const dobFormikField = dateOfBirthField.dive().find(Field)
    const dateTimePicker = dobFormikField.renderProp('render')({field: {value: '', onChange: () => true}, form: {setFieldValue: () => true}})
    // dateTimePicker.simulate('change', { value: new Date() })
    dateTimePicker.prop('onChange')(new Date())
    expect(dateOfBirthField.prop('value')).toEqual(dob)
    ageField.setState({selected: ''})
  })
  xit('clears approximate age units when switching selected to empty')
  xit('clears approximate age when switching selected to empty')
})
