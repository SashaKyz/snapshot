import React from 'react'
import {Field} from 'formik'
import ApproximateAgeField from 'views/advancedSearch/ApproximateAgeField'
import DateOfBirthField from 'views/advancedSearch/DateOfBirthField'
import SearchByAgeWrapper from 'views/advancedSearch/formikWrappers/SearchByAgeWrapper.jsx'

export default class AgeField extends React.Component {
  state = {
    selected: 'dob',
  }
  initialState={
    selected: 'dob',
  }
  inputRef=React.createRef()

  onSearchByAge(e, callback) {
    return this.setState({selected: e.target.value}, callback(e))
  }

  clear() {
    this.setState(this.initialState)
    this.inputRef.current.clear()
  }

  render() {
    const {selected} = this.state
    return (
      <div className="age-search-field-container col-md-3">
        <label htmlFor='search-by-age-method'>Age</label>
        <Field
          id='search-by-age-method'
          name='searchByAgeMethod'
          component={SearchByAgeWrapper}
          onSearchByAge={this.onSearchByAge.bind(this)}
        />
        { selected === 'dob' && <DateOfBirthField ref={this.inputRef} /> }
        { selected === 'approximate' && <ApproximateAgeField /> }
        { selected === '' && <div className="col-md-6"/> }
      </div>
    )
  }
}
