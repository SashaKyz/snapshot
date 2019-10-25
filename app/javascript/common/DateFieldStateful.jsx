import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import FormField from 'common/FormField'
import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import moment from 'moment-timezone'
import momentLocalizer from 'react-widgets/lib/localizers/moment'
import {isValidDate, dateFormatToYYYYMMDD} from 'utils/dateFormatter'

momentLocalizer(moment)

class DateFieldStateful extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: this.props.errors,
      value: this.props.value,
      shadowValue: this.props.value
    }
  }

  handleOnChange(date) {
    if (date === undefined) {
      date = this.state.value
    }

    this.setState({value: date})
    if (date === null) {
      this.props.onChange(null)
      return
    }

    this.props.onChange(dateFormatToYYYYMMDD(date))
  }

  handleOnBlur() {
    if (!_.isEmpty(this.state.shadowValue) && Number.isNaN(Date.parse(this.state.shadowValue))) {
      this.setState({errors: ["Please enter a valid date"]})
    } else {
      this.setState({errors: []})
    }

    this.props.onBlur()
  }

  handleOnKeyUp(event) {
      if ((event.target.value === '') || (event.target.value === undefined) || (event.target.value === null)) {
        this.props.onChange('')
        this.setState({
          value: null,
          shadowValue: null
        })
      } else if (isValidDate(event.target.value)) {
        this.setState({
          value: moment(event.target.value, 'MM/DD/YYYY').toDate(),
          shadowValue: null
        })
        this.props.onChange(moment(event.target.value, 'MM/DD/YYYY').format('YYYY-MM-DD'))
      }
  }

  currentErrors() {
    if (!_.isEmpty(this.props.errors)) {
      return this.props.errors
    } else {
      return this.state.errors
    }
  }

  mainRender() {
    return (
      <FormField
        htmlFor={`${this.props.id}_input`}
        label={this.props.label}
        gridClassName={this.props.gridClassName}
        labelClassName={this.props.labelClassName}
        required={this.props.required}
        errors={this.currentErrors()}
      >
        <DateTimePicker
          aria-required={this.props.required}
          calendar={this.props.hasCalendar}
          value={this.state.value || null}
          format={'MM/DD/YYYY'}
          id={this.props.id}
          onBlur={() => this.handleOnBlur()}
          onChange={value => this.handleOnChange(value)}
          placeholder={'MM/DD/YYYY'}
          parse={ input => {
            this.setState({ shadowValue: input})
          }}
          required={this.props.required}
          time={this.props.hasTime}
          max={this.props.max}
          min={this.props.min}
          disabled={this.props.disabled}
          onKeyUp={event => this.handleOnKeyUp(event)}
          onKeyPress={this.props.onKeyPress}
        />
      </FormField>
    )
  }

  render() {
    return this.mainRender()
  }
}

DateFieldStateful.defaultProps = {
  hasTime: false,
  hasCalendar: true,
}

DateFieldStateful.propTypes = {
  disabled: PropTypes.bool,
  errors: PropTypes.array,
  gridClassName: PropTypes.string,
  hasCalendar: PropTypes.bool,
  hasTime: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.string,
}
export default DateFieldStateful
