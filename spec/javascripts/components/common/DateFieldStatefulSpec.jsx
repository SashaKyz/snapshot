import React from 'react'
import {shallow} from 'enzyme'
import DateFieldStateful from 'common/DateFieldStateful'
import moment from 'moment-timezone'

describe('DateFieldStateful', () => {
  const renderDateFieldStateful = ({
    onChange = jasmine.createSpy('onChange'),
    onBlur = jasmine.createSpy('onBlur'),
    onKeyUp = jasmine.createSpy('onKeyUp'),
    value,
  } = {}) => shallow(<DateFieldStateful id='' label='label' value={value} onChange={onChange} onBlur={onBlur} onKeyUp={onKeyUp} />)

  describe('rendering', () => {
    it('renders a FormField', () => {
      const component = renderDateFieldStateful()
      expect(component.find('FormField').length).toEqual(1)
    })

    it('renders a DateTimePicker', () => {
      const component = renderDateFieldStateful()
      const formField = component.find('FormField')
      const formChildren = formField.children()
      expect(formChildren.shallow().find('DateTimePicker').length).toEqual(1)
    })
  })

  describe('#handleOnBlur', () => {
    it('sets an invalid date error and clears the value when the value is not a valid date string', () => {
      const component = renderDateFieldStateful({value: 'asdf'})
      const instance = component.instance()
      instance.handleOnBlur()
      expect(instance.props.onBlur).toHaveBeenCalled()
      expect(instance.state.errors).toEqual(['Please enter a valid date'])
      expect(component.state.value).toEqual(undefined)
    })

    it('clears errors if the shadowvalue is empty', () => {
      const component = renderDateFieldStateful({value: ''})
      const instance = component.instance()
      instance.handleOnBlur()
      expect(instance.props.onBlur).toHaveBeenCalled()
      expect(instance.state.errors).toEqual([])
    })

    it('clears errors if the shadowvalue is valid', () => {
      const component = renderDateFieldStateful({value: '10/10/2000'})
      const instance = component.instance()
      instance.handleOnBlur()
      expect(instance.props.onBlur).toHaveBeenCalled()
      expect(instance.state.errors).toEqual([])
    })
  })

  describe('#handleOnChange', () => {
    it('converts to a YYYY-MM-DD date and calls onChange', () => {
      const component = renderDateFieldStateful({value: ''})
      const instance = component.instance()
      instance.handleOnChange(new Date('01/01/2001'))
      const onChange = instance.props.onChange
      expect(onChange.calls.mostRecent().args[0]).toEqual('2001-01-01')
      expect(onChange).toHaveBeenCalled()
    })

    it('calls onchange if the date is null', () => {
      const component = renderDateFieldStateful()
      const instance = component.instance()
      instance.handleOnChange(null)
      expect(instance.props.onChange).toHaveBeenCalled()
    })

    it('sets the value to the date', () => {
      const date = new Date('10/10/2000')
      const component = renderDateFieldStateful()
      const instance = component.instance()
      instance.handleOnChange(date)
      expect(instance.state.value).toEqual(date)
    })
  })

  describe('onKeyUp', () => {
    it('calls onChange and sets value to null when dob is empty', () => {
      const component = renderDateFieldStateful()
      const instance = component.instance()
      instance.handleOnKeyUp({target: {value: ''}})
      expect(instance.props.onChange).toHaveBeenCalledWith('')
      expect(instance.state.value).toEqual(null)
      expect(instance.state.shadowValue).toEqual(null)
    })

    it('calls onChange and sets value to null when dob is null', () => {
      const component = renderDateFieldStateful()
      const instance = component.instance()
      instance.handleOnKeyUp({target: {value: null}})
      expect(instance.props.onChange).toHaveBeenCalledWith('')
      expect(instance.state.value).toEqual(null)
      expect(instance.state.shadowValue).toEqual(null)
    })

    it('calls onChange and sets value to null when dob is undefined', () => {
      const component = renderDateFieldStateful()
      const instance = component.instance()
      instance.handleOnKeyUp({target: {value: undefined}})
      expect(instance.props.onChange).toHaveBeenCalledWith('')
      expect(instance.state.value).toEqual(null)
      expect(instance.state.shadowValue).toEqual(null)
    })

    it('sets the value and calls onChange when dob is a valid date', () => {
      const date = '10/10/2000'
      const component = renderDateFieldStateful()
      const instance = component.instance()
      instance.handleOnKeyUp({target: {value: date}})
      expect(instance.props.onChange).toHaveBeenCalledWith(moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD'))
      expect(instance.state.value).toEqual(moment(date, 'MM/DD/YYYY').toDate())
      expect(instance.state.shadowValue).toEqual(null)
    })
  })
})
