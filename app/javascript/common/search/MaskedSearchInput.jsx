import React from 'react'
import PropTypes from 'prop-types'
import HyphenatedMaskedInput from 'common/HyphenatedMaskedInput'
import {toCamelCase, toCapitalCase} from 'utils/textFormatter'

const MaskedSearchInput = ({name, onBlur, onChange, onFocus, ...props}) => {
  const camelName = toCamelCase(name, /-/g)
  const capitalName = toCapitalCase(name, /-/g)
  return (
    <HyphenatedMaskedInput
      id={`search-${name}`}
      gridClassName={`col-md-3 ${name}-field`}
      onBlur={() => onBlur(`${camelName}ErrorCheck`)}
      onChange={({target: {value}}) => onChange(`search${capitalName}`, value)}
      onFocus={() => onFocus(`${camelName}ErrorCheck`)}
      {...props}
    />
  )
}

MaskedSearchInput.propTypes = {
  errors: PropTypes.array,
  label: PropTypes.string.isRequired,
  mask: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default MaskedSearchInput
