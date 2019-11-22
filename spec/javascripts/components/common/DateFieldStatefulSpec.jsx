import React from 'react'
import {shallow, mount} from 'enzyme'
import DateFieldStateful from 'common/DateFieldStateful'
import moment from 'moment-timezone'

describe('DateFieldStateful', () => {
  function mountDateFieldStateful({
    gridClassName,
    hasCalendar,
    hasTime,
    id = '',
    label = '',
    labelClassName,
    max,
    min,
    onBlur = () => null,
    onChange = () => null,
    required = undefined,
    value,
    disabled = false,
    onKeyUp = () => null,
    onKeyPress = () => null,
  } = {}) {
    const props = {
      gridClassName,
      hasCalendar,
      hasTime,
      id,
      label,
      labelClassName,
      max,
      min,
      onBlur,
      onChange,
      required,
      value,
      disabled,
      onKeyUp,
      onKeyPress,
    }
    return mount(<DateFieldStateful {...props}/>)
  }

  function renderDateFieldStateful({
    errors = [],
    gridClassName,
    id = '',
    label = '',
    labelClassName,
    onBlur = () => null,
    onChange = () => null,
    required = undefined,
    disabled = false,
    onKeyPress = () => null,
    onKeyUp = () => null,
  }) {
    const props = {
      errors,
      gridClassName,
      id,
      label,
      labelClassName,
      onBlur,
      onChange,
      required,
      disabled,
      onKeyPress,
      onKeyUp,
    }
    return shallow(<DateFieldStateful {...props}/>, {disableLifecycleMethods: true})
  }

  describe('rendering', () => {
    it('renders a FormField', () => {
      const component = renderDateFieldStateful({})
      expect(component.find('FormField').length).toEqual(1)
    })

    it('renders a DateTimePicker', () => {
      const component = mountDateFieldStateful({})
      expect(component.find('DateTimePicker').length).toEqual(1)
    })
  })

  describe('#handleOnBlur', () => {
    it('sets an invalid date error and clears the value when the value is not a valid date string', () => {
      const onBlur = jasmine.createSpy('onBlur')
      const component = shallow(<DateFieldStateful value='asdf' onBlur={onBlur} />)
      const instance = component.instance()
      spyOn(instance, 'currentErrors').and.callThrough()
      instance.handleOnBlur()
      expect(onBlur).toHaveBeenCalled()
      expect(instance.currentErrors).toHaveBeenCalled()
      expect(instance.state.errors).toEqual(['Please enter a valid date'])
      expect(component.state.value).toEqual(undefined)
    })

    it('clears errors if the shadowvalue is empty', () => {
      const onBlur = jasmine.createSpy('onBlur')
      const component = shallow(<DateFieldStateful value='' onBlur={onBlur} />)
      const instance = component.instance()
      spyOn(instance, 'currentErrors').and.callThrough()
      instance.handleOnBlur()
      expect(onBlur).toHaveBeenCalled()
      expect(instance.currentErrors).toHaveBeenCalled()
      expect(instance.state.errors).toEqual([])
    })

    it('clears errors if the shadowvalue is valid', () => {
      const onBlur = jasmine.createSpy('onBlur')
      const component = shallow(<DateFieldStateful value='10/10/2000' onBlur={onBlur} />)
      const instance = component.instance()
      spyOn(instance, 'currentErrors').and.callThrough()
      instance.handleOnBlur()
      expect(onBlur).toHaveBeenCalled()
      expect(instance.currentErrors).toHaveBeenCalled()
      expect(instance.state.errors).toEqual([])
    })
  })

  describe('#handleOnChange', () => {
    it('converts to a YYYY-MM-DD date and calls onChange', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = mountDateFieldStateful({value: '', onChange})
      const instance = component.instance()
      instance.handleOnChange(new Date('01/01/2001'))
      expect(onChange.calls.mostRecent().args[0]).toEqual('2001-01-01')
      expect(onChange).toHaveBeenCalled()
    })

    it('calls onchange if the date is null', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = shallow(<DateFieldStateful onChange={onChange} />)
      const instance = component.instance()
      instance.handleOnChange(null)
      expect(onChange).toHaveBeenCalled()
    })

    it('sets the value to the date', () => {
      const date = new Date('10/10/2000')
      const onChange = jasmine.createSpy('onChange')
      const component = shallow(<DateFieldStateful onChange={onChange} />)
      const instance = component.instance()
      instance.handleOnChange(date)
      expect(instance.state.value).toEqual(date)
    })
  })

  describe('onKeyUp', () => {
    it('calls onChange and sets value to null when dob is empty', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = shallow(<DateFieldStateful onChange={onChange} />)
      const instance = component.instance()
      instance.handleOnKeyUp({target: {value: ''}})
      expect(onChange).toHaveBeenCalledWith('')
      expect(instance.state.value).toEqual(null)
      expect(instance.state.shadowValue).toEqual(null)
    })

    it('calls onChange and sets value to null when dob is null', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = shallow(<DateFieldStateful onChange={onChange} />)
      const instance = component.instance()
      instance.handleOnKeyUp({target: {value: null}})
      expect(onChange).toHaveBeenCalledWith('')
      expect(instance.state.value).toEqual(null)
      expect(instance.state.shadowValue).toEqual(null)
    })

    it('calls onChange and sets value to null when dob is undefined', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = shallow(<DateFieldStateful onChange={onChange} />)
      const instance = component.instance()
      instance.handleOnKeyUp({target: {value: undefined}})
      expect(onChange).toHaveBeenCalledWith('')
      expect(instance.state.value).toEqual(null)
      expect(instance.state.shadowValue).toEqual(null)
    })

    it('sets the value and calls onChange when dob is a valid date', () => {
      const date = '10/10/2000'
      const onChange = jasmine.createSpy('onChange')
      const component = shallow(<DateFieldStateful onChange={onChange} />)
      const instance = component.instance()
      instance.handleOnKeyUp({target: {value: date}})
      expect(onChange).toHaveBeenCalledWith(moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD'))
      expect(instance.state.value).toEqual(moment(date, 'MM/DD/YYYY').toDate())
      expect(instance.state.shadowValue).toEqual(null)
    })
  })
})
