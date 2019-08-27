import React, {Component} from 'react'
import PropTypes from 'prop-types'
import AttachLink from 'common/relationship/AttachLink'
import EditRelationshipModal from 'common/relationship/EditRelationshipModal'
import {RelationshipPropType} from 'data/relationships'

export class ActionMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {show: false}
    this.closeModal = this.closeModal.bind(this)
    this.handleShowModal = this.handleShowModal.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.isSaving === false && prevProps.isSaving !== false) {
      this.closeModal()
    }
  }

  closeModal() {
    this.setState({show: false})
  }

  handleShowModal() {
    const {onEdit, person, relationship} = this.props
    this.setState({show: true})
    onEdit(person, relationship)
  }

  renderModal() {
    const {
      editFormRelationship,
      errors,
      isInvalidForm,
      isSaving,
      onChange,
      onSave,
      person,
      relationship,
    } = this.props

    return (
      <EditRelationshipModal
        editFormRelationship={editFormRelationship}
        errors={errors}
        closeModal={this.closeModal}
        isInvalidForm={isInvalidForm}
        isSaving={isSaving}
        onChange={onChange}
        onSave={onSave}
        person={person}
        relationship={relationship}
        show={this.state.show}
      />
    )
  }

  render() {
    return (
      <div>
        <div className='dropdown' aria-label='Action Menu'>
          <span className='glyphicon glyphicon-option-vertical' type='button' data-toggle='dropdown' aria-hidden='true'/>
          <ul className='dropdown-menu dropdown-menu-right' role='menu' aria-hidden='true'>
            <li className='dropdown-header'>Actions</li>
            <li role='separator' className='divider'/>
            <li role='menuitem'><AttachLink {...this.props}/></li>
            <li role='menuitem'>
              <a className='edit-relationship' href='#/' onClick={this.handleShowModal}>
                Edit Relationship
              </a>
            </li>
          </ul>
        </div>
        {this.state.show && this.renderModal()}
      </div>
    )
  }
}

const personPropType = PropTypes.shape({
  age: PropTypes.string,
  dateOfBirth: PropTypes.string,
  legacy_id: PropTypes.string,
  gender: PropTypes.string,
  name: PropTypes.string,
})

ActionMenu.propTypes = {
  editFormRelationship: PropTypes.shape({
    absent_parent_indicator: PropTypes.bool,
    client_id: PropTypes.string,
    end_date: PropTypes.string,
    id: PropTypes.string,
    relationship_type: PropTypes.number,
    relative_id: PropTypes.string,
    same_home_status: PropTypes.string,
    start_date: PropTypes.string,
  }),
  errors: PropTypes.shape({
    started_at: PropTypes.array,
  }),
  isInvalidForm: PropTypes.bool,
  isSaving: PropTypes.bool,
  isScreening: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  pendingPeople: PropTypes.arrayOf(PropTypes.string),
  person: personPropType,
  relationship: RelationshipPropType,
  screeningId: PropTypes.string,
}

export default ActionMenu
