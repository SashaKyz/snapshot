import React from 'react'
import {Field, ErrorMessage} from 'formik'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import ErrorMessages from 'common/ErrorMessages'
import moment from 'moment'
import momentLocalizer from 'react-widgets/lib/localizers/moment'

momentLocalizer(moment)

class DateOfBirthField extends React.Component {
  state = {value: null}
  initialState = {value: null}

  clear() {
    this.setState(this.initialState)
  }

  render() {
    return (
      <div>
        <label htmlFor='search-date-of-birth_input'>Date</label>
        <Field name='dateOfBirth' render={({field: {value, onChange, ...fields}, form: {setFieldValue}}) => {
          return (
          <DateTimePicker
            {...fields}
            id='search-date-of-birth'
            value={this.state.value}
            parse={(v) => {
              const isValid = moment(v).isValid()
              const fieldValue = isValid ? moment(v).format('YYYY-MM-DD') : v
              setFieldValue('dateOfBirth', fieldValue)
              return new Date(v)
            }}
            onChange={value => this.setState({value})}
            placeholder='MM/DD/YYYY'
            time={false}
          />)} }
        />
        <ErrorMessage name='dateOfBirth' render={(errors, touched) => <ErrorMessages errors={errors}/>} />
      </div>
    )
  }
}

export default DateOfBirthField
