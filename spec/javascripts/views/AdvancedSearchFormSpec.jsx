import React from 'react'
import {shallow} from 'enzyme'
import {Form, ErrorMessage} from 'formik'
import {AdvancedSearchForm} from 'views/AdvancedSearchForm'

describe('AdvancedSearchForm', () => {
  it('renders a formik component with initial values', () => {
    const advancedSearchForm = shallow(<AdvancedSearchForm />)
    const formik = advancedSearchForm.find('Formik')
    expect(formik.exists()).toEqual(true)
    expect(formik.prop('initialValues')).toEqual({
      'lastName': '',
      'firstName': '',
      'middleName': '',
      'suffix': '',
      'searchByAgeMethod': 'dob',
      'dateOfBirth': null,
      'gender': '',
      'clientId': '',
      'ssn': '',
      'county': '',
      'ageUnitMonths': '',
      'ageUnitYears': '',
    })
  })

  it('renders a formik form with a custom validation function', () => {
    const advancedSearchForm = shallow(<AdvancedSearchForm />)
    const formik = advancedSearchForm.find('Formik')
    expect(formik.exists()).toEqual(true)
    expect(formik.prop('validate')).toEqual(jasmine.any(Function))
  })

  it('renders a formik form that validates on change', () => {
    const advancedSearchForm = shallow(<AdvancedSearchForm />)
    const formik = advancedSearchForm.find('Formik')
    expect(formik.exists()).toEqual(true)
    expect(formik.prop('validateOnChange')).toEqual(true)
  })

  it('renders a formik form that calls onSearch on submit', () => {
    const onSearch = jasmine.createSpy('onSearch')
    const advancedSearchForm = shallow(<AdvancedSearchForm onSearch={onSearch}/>)
    const formik = advancedSearchForm.find('Formik')
    expect(formik.exists()).toEqual(true)
    formik.simulate('submit')
    expect(onSearch).toHaveBeenCalled()
  })

  it('renders a formik form', () => {
    const advancedSearchForm = shallow(<AdvancedSearchForm />)
    const formik = advancedSearchForm.find('Formik')
    const form = formik.dive().find(Form)
    expect(form.exists()).toEqual(true)
  })

  it('renders NameFields', () => {
    const advancedSearchForm = shallow(<AdvancedSearchForm />)
    const formik = advancedSearchForm.find('Formik')
    const form = formik.dive().find(Form)
    const nameFields = form.find('NameFields')
    expect(nameFields.exists()).toEqual(true)
  })

  it('renders SexAtBirthAndCountyFields', () => {
    const advancedSearchForm = shallow(<AdvancedSearchForm />)
    const formik = advancedSearchForm.find('Formik')
    const form = formik.dive().find(Form)
    const sexAtBirthAndCountyFields = form.find('SexAtBirthAndCountyFields')
    expect(sexAtBirthAndCountyFields.exists()).toEqual(true)
  })

  it('renders Client ID field as a masked input and error messages for client ID', () => {
    const advancedSearchForm = shallow(<AdvancedSearchForm />)
    const formik = advancedSearchForm.find('Formik')
    const form = formik.dive().find(Form)
    const clientIdField = form.find({name: 'clientId', id: 'clientId'})
    expect(clientIdField.exists()).toEqual(true)
    const rendered = clientIdField.renderProp('render')({})
    const maskedInput = rendered.find('MaskedInput')
    expect(maskedInput.exists()).toEqual(true)
    const errorMessage = form.find(ErrorMessage).find({name: 'clientId'})
    expect(errorMessage.exists()).toEqual(true)
  })

  it('renders SSN field as a masked input and error messages for SSN', () => {
    const advancedSearchForm = shallow(<AdvancedSearchForm />)
    const formik = advancedSearchForm.find('Formik')
    const form = formik.dive().find(Form)
    const ssnField = form.find({name: 'ssn', id: 'ssn'})
    expect(ssnField.exists()).toEqual(true)
    const rendered = ssnField.renderProp('render')({})
    const maskedInput = rendered.find('MaskedInput')
    expect(maskedInput.exists()).toEqual(true)
    const errorMessage = form.find(ErrorMessage).find({name: 'ssn'})
    expect(errorMessage.exists()).toEqual(true)
  })
})
