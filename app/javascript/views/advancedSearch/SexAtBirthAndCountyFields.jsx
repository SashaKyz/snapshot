import React from 'react'
import {Field, ErrorMessage} from 'formik'
import ErrorMessages from 'common/ErrorMessages'
import GENDERS from 'enums/Genders'
import Counties from 'data/lov/county'

const SexAtBirthAndCountyFields = () => {
  const countiesOptions = Counties.filter(({value}) => value !== 'State of California')
  return (
    <div className="sex-at-birth-and-county-container col-md-3">
      <label htmlFor='search-sex-at-birth'>Sex at Birth</label>
      <Field
        id='search-sex-at-birth'
        name='gender'
        render={({field}) => (
          <select {...field}>
            <option key="" />
            {Object.keys(GENDERS).map(key => <option key={key} value={key}>{GENDERS[key]}</option>)}
          </select>
        )}
      />
      <ErrorMessage name='gender' render={(errors, touched) => <ErrorMessages errors={errors}/>} />
      <label htmlFor='search-county'>County</label>
      <Field
        id='search-county'
        name='county'
        render={({field}) => (
          <select {...field}>
            <option key="" />
            {Object.keys(countiesOptions).map((key) => <option key={key} value={key}>{countiesOptions[key].value}</option>)}
          </select>
        )}
      />
      <ErrorMessage name='county' render={(errors, touched) => <ErrorMessages errors={errors}/>} />
    </div>
  )
}

export default SexAtBirthAndCountyFields
