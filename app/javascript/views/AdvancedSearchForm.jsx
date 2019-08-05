import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {Formik, Form, Field, ErrorMessage} from 'formik'
import ErrorMessages from 'common/ErrorMessages'
import MaskedInput from 'react-maskedinput'
import PersonSearchButtonGroup from 'common/search/PersonSearchButtonGroup'
import {search} from 'actions/peopleSearchActions'
import AgeField from 'views/advancedSearch/AgeField'
import {validationSchema} from 'views/advancedSearch/AdvancedSearchValidationSchema'
import {
  selectResultsTotalValue,
  selectLoadingStatus,
} from 'selectors/peopleSearchSelectors'
import NameFields from 'views/advancedSearch/NameFields'
import SexAtBirthAndCountyFields from 'views/advancedSearch/SexAtBirthAndCountyFields'

class AdvancedSearchForm extends React.Component {
  initialValues = {
    'lastName': '',
    'firstName': '',
    'middleName': '',
    'suffix': '',
    'searchByAgeMethod': 'dob',
    'dateOfBirth': null,
    'gender': '',
    'clientId': '',
    'ssn': '',
    'county': '',
    'ageUnitMonths': '',
    'ageUnitYears': '',
  }
  inputRef = React.createRef()

  isSearchDisabled(values) {
    return values.lastName.length > 0 ||
      values.clientId.match(/\d{4}-\d{4}-\d{4}-\d{7}/g) ||
      values.ssn.match(/\d{3}-\d{2}-\d{4}/g) ||
      values.dateOfBirth !== null
  }

  render() {
    const {total, isFetching} = this.props
    return (
      <div>
        <Formik
          initialValues={this.initialValues}
          onSubmit={(values, actions) => this.props.onSearch(values)}
          validateOnChange={true}
          validate={values => {
            try {
              validationSchema.validateSync(values, {abortEarly: false})
              return {}
            } catch (error) {
              return error.inner.reduce((acc, current) => ({...acc, [current.path]: [current.message, ...(acc[current.path] || [])]}), {})
            }
          }}
        >
          {({resetForm, values, handleSubmit, errors}) => (
            <Form>
              <NameFields />
              <div className="row">
                <AgeField ref={this.inputRef} />
                <SexAtBirthAndCountyFields />
                <div className="clientId-field col-md-3">
                  <label htmlFor='clientId'>Client ID Number</label>
                  <Field
                    id='clientId'
                    name='clientId'
                    render={({field}) =>
                      <MaskedInput
                        {...field}
                        className='masked-input'
                        id='clientId'
                        name='clientId'
                        mask='1111-1111-1111-1111111'
                        placeholder=''
                        required={false}
                        aria-required='false'
                        autoComplete={'off'}
                      />}
                  />
                  <ErrorMessage name='clientId' render={(errors, touched) => <ErrorMessages errors={errors}/>} />
                </div>
                <div className="clientId-field col-md-3">
                  <label htmlFor='ssn'>Social Security Number</label>
                  <Field
                    id='ssn'
                    name='ssn'
                    render={({field}) =>
                      <MaskedInput
                        {...field}
                        className='masked-input'
                        id='ssn'
                        name='ssn'
                        mask='111-11-1111'
                        placeholder=''
                        required={false}
                        aria-required='false'
                        autoComplete={'off'}
                      />}
                  />
                  <ErrorMessage name='ssn' render={(errors, touched) => <ErrorMessages errors={errors}/>} />
                </div>
              </div>
              <PersonSearchButtonGroup
                onCancel={() => {
                  resetForm(this.initialValues)
                  this.inputRef.current.clear()
                }}
                onSubmit={handleSubmit}
                canSearch={this.isSearchDisabled(values)}
                total={total}
                isFetching={isFetching}
              />
            </Form>)}
        </Formik>
      </div>)
  }
}

AdvancedSearchForm.propTypes = {
  isFetching: PropTypes.bool,
  onSearch: PropTypes.func,
  total: PropTypes.number,
}

const mapStateToProps = (state) => ({
  isFetching: selectLoadingStatus(state),
  total: selectResultsTotalValue(state),
})
const mapDispatchToProps = (dispatch, ownProps) => ({
  onSearch: (values, isAdvancedSearchOn = true) => dispatch(search(ownProps.isClientOnly, isAdvancedSearchOn, values, 0)),
})

export {AdvancedSearchForm}

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearchForm)
