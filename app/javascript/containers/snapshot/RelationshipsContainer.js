import {connect} from 'react-redux'
import {Relationships} from 'common/Relationships'
import {getPeopleSelector} from 'selectors/screening/relationshipsSelectors'
import {selectClientIds} from 'selectors/participantSelectors'
import {createSnapshotPerson} from 'actions/personCardActions'
import {getCountyNameSelector} from 'selectors/userInfoSelectors'

const mapStateToProps = (state, _ownProps) => ({
  people: getPeopleSelector(state).toJS(),
  isScreening: false,
  participants: selectClientIds(state),
  pendingPeople: state.get('pendingParticipants').toJS(),
  county: getCountyNameSelector(state),
})

const mapDispatchToProps = dispatch => ({
  onClick: relationship => {
    const id =
      relationship.legacy_descriptor && relationship.legacy_descriptor.legacy_id
    dispatch(createSnapshotPerson(id))
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Relationships)
