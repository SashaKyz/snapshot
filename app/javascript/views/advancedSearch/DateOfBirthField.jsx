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
              const isValid = moment(v, 'MM/DD/YYYY').isValid()
              const fieldValue = isValid ? moment(v, 'MM/DD/YYYY').toDate() : v
              setFieldValue('dateOfBirth', fieldValue)
              return new Date(fieldValue)
            }}
            onSelect={value => this.setState({value}, () => setFieldValue('dateOfBirth', moment(value,'MM/DD/YYYY').toDate()))}
            onChange={value => this.setState({value}, () => setFieldValue('dateOfBirth', moment(value, 'MM/DD/YYYY').toDate()))}
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
