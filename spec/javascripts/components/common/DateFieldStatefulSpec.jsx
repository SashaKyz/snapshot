import React from 'react'
import {shallow, mount} from 'enzyme'
import DateFieldStateful from 'common/DateFieldStateful'

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
    it('converts to a YYYY-MM-DD date', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = mountDateFieldStateful({value: '', onChange})
      const instance = component.instance()
      instance.handleOnChange(new Date('01/01/2001'))
      expect(onChange.calls.mostRecent().args[0]).toEqual('2001-01-01')
    })
  })
})
