import React from 'react'
import PropTypes from 'prop-types'
import {Field} from 'formik'
import {APPROXIMATE_AGE_UNIT_VALUES} from 'enums/ApproximateAgeUnits'

export default class ApproximateAgeSelect extends React.Component {
  render() {
    const {selected} = this.props
    const min = selected ? APPROXIMATE_AGE_UNIT_VALUES[selected].min : 1
    const max = selected ? APPROXIMATE_AGE_UNIT_VALUES[selected].max : 1
    return (
      <div className="col-md-6 approximate-age-selector number">
        <label htmlFor="approximateAge">Number</label>
        <Field component="select" name="approximateAge">
          <option key="" value=""/>
          { Array(max - min).fill().map((_, index) => (
            <option key={index + 1} value={index + 1}>{index + 1}</option>
          ))}
        </Field>
      </div>
    )
  }
}

ApproximateAgeSelect.propTypes = {
  selected: PropTypes.string,
}
