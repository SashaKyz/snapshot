import {connect} from 'react-redux'
import DateOfBirthDateField from 'common/search/age/DateOfBirthDateField'
import PersonCard from 'views/people/PersonCard'

const mapStateToProps = (state) => {
  console.log('called')
  // return {value: ''}
  return {value: state}
}

export default connect(mapStateToProps)(DateOfBirthDateField)
