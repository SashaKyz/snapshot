import React from 'react'
import {shallow} from 'enzyme'
import {Field, ErrorMessage} from 'formik'
import DateOfBirthField from 'views/advancedSearch/DateOfBirthField'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'

describe('DateOfBirthField', () => {
  it('renders a date of birth field with a DateTimePicker component', () => {
    const dateOfBirthField = shallow(<DateOfBirthField />)
    const field = dateOfBirthField.find(Field)
    const rendered = field.renderProp('render')({field: {value: ''}, form: {setFieldValue: () => true}})
    const dateTimePicker = rendered.find(DateTimePicker)
    expect(dateTimePicker.exists()).toEqual(true)
  })

  it('renders error messages for date of birth', () => {
    const dateOfBirthField = shallow(<DateOfBirthField />)
    const errorMessage = dateOfBirthField.find(ErrorMessage)
    expect(errorMessage.exists()).toEqual(true)
    expect(errorMessage.prop('name')).toEqual('dateOfBirth')
  })
})
