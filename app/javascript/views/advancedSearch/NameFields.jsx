import React from 'react'
import {Field, ErrorMessage} from 'formik'
import ErrorMessages from 'common/ErrorMessages'

const NameFields = () =>
  <div className="row">
    <div className="last-name-field col-md-3">
      <label htmlFor='search-last-name' className="last-name-field">Last Name</label>
      <Field
        id='search-last-name'
        name='lastName'
        maxLength={25}
      />
      <ErrorMessage name='lastName' render={(errors, touched) => <ErrorMessages errors={errors}/>} />
    </div>
    <div className="first-name-field col-md-3">
      <label htmlFor='search-first-name'>First Name</label>
      <Field
        id='search-first-name'
        name='firstName'
        maxLength={20}
      />
      <ErrorMessage name='firstName' render={(errors, touched) => <ErrorMessages errors={errors}/>} />
    </div>
    <div className="middle-name-field col-md-3">
      <label htmlFor='search-middle-name'>Middle Name</label>
      <Field
        id='search-middle-name'
        name='middleName'
        maxLength={20}
      />
      <ErrorMessage name='middleName' render={(errors, touched) => <ErrorMessages errors={errors}/>} />
    </div>
    <div className="suffix-field col-md-3">
      <label htmlFor='search-suffix'>Suffix</label>
      <Field
        id='search-suffix'
        name='suffix'
        maxLength={4}
      />
      <ErrorMessage name='suffix' render={(errors, touched) => <ErrorMessages errors={errors}/>} />
    </div>
  </div>

export default NameFields
