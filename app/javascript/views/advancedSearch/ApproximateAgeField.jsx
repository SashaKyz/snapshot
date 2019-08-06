import React from 'react'
import {Field} from 'formik'
import ApproximateAgeSelect from 'views/advancedSearch/ApproximateAgeSelect'

class ApproximateAgeField extends React.Component {
  state={
    selected: undefined,
  }

  render() {
    const {selected} = this.state
    return (
      <div className="approximate-age-section">
        <div className="col-md-6 approximate-age-selector unit">
          <label htmlFor='age-unit-months'>Unit</label>
          <div className="age-unit-months" role="presentation">
            <Field
              id='age-unit-months'
              type="radio"
              component="input"
              name='age-unit-months'
              key='months'
              value='months'
              onChange={(e) => this.setState({selected: e.target.value})}
              checked={selected === 'months'}
            />
            <label htmlFor='age-unit-months'>Months</label>
          </div>
          <div className="age-unit-years" role="presentation">
            <Field
              id='age-unit-years'
              type="radio"
              component="input"
              name='age-unit-years'
              key='years'
              value='years'
              onChange={(e) => this.setState({selected: e.target.value})}
              checked={selected === 'years'}
            />
            <label htmlFor='age-unit-years'>Years</label>
          </div>
        </div>
        <ApproximateAgeSelect selected={selected}/>
      </div>
    )
  }
}

export default ApproximateAgeField
