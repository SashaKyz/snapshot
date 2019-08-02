import React from 'react'
import PropTypes from 'prop-types'

const SearchByAgeWrapper = ({field: {onChange, value, ...field}, onSearchByAge}) =>
  <select
    {...field}
    value={value}
    onChange={(e) => onSearchByAge(e, onChange)}
  >
    <option key="" value=""/>
    <option key="dob" value="dob">Date of Birth</option>
    <option key="approximate" value="approximate">Approximate Age</option>
  </select>

SearchByAgeWrapper.propTypes = {
  field: PropTypes.object,
  onSearchByAge: PropTypes.func,
}

export default SearchByAgeWrapper
