import React from 'react'
import PropTypes from 'prop-types'
import DateField from 'common/DateField'
import DateOfBirthDateContainer from 'containers/snapshot/DateOfBirthFieldContainer'

class DateOfBirthDateField extends React.Component {
  render() {
    const {value, onBlur, onChange, errors, onKeyUp, onKeyPress} = this.props
    const handleBlur = () => onBlur('dateOfBirth')
    const handleChange = value => onChange('dateOfBirth', value)

    return (
      // <DateOfBirthDateFieldContainer>
        <DateField
          id="search-date-of-birth"
          gridClassName="date-field"
          label="Date"
          value={value}
          onBlur={handleBlur}
          onChange={handleChange}
          hasTime={false}
          errors={errors}
          onKeyUp={onKeyUp}
          onKeyPress={onKeyPress}
        />
      // </DateOfBirthDateFieldContainer>
    )
  }
}

DateOfBirthDateField.propTypes = {
  errors: PropTypes.array,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  value: PropTypes.string,
}

export default DateOfBirthDateField
