import React from 'react'
import PropTypes from 'prop-types'
import Autocompleter from 'common/search/Autocompleter'
import {withRouter} from 'react-router'
import {PersonSearchFieldsPropType} from 'data/personSearch'
import {isAdvancedSearchOn} from 'common/config'
import ModalComponent from 'common/ModalComponent'
import SearchModalBody from 'common/search/SearchModalBody'
import AdvancedSearchForm from 'views/AdvancedSearchForm'

class PersonSearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {show: false}
    this.closeModal = this.closeModal.bind(this)
    this.handleShowModal = this.handleShowModal.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.enterKey = 13
  }

  closeModal() {
    this.setState({show: false})
  }

  handleShowModal() {
    this.setState({show: true})
  }

  handleKeyPress(e) {
    if (e.charCode === this.enterKey) {
      this.handleShowModal()
    }
  }

  renderModal() {
    const ModalFooter = () => {
      return <div><button className='btn modal-footer-button' onClick={this.closeModal}>OK</button></div>
    }
    return (
      <ModalComponent
        closeModal={this.closeModal}
        showModal={this.state.show}
        modalTitle='How to Use Snapshot'
        modalBody={<SearchModalBody />}
        modalSize='large'
        modalFooter={<ModalFooter />}
      />
    )
  }

  render() {
    const {searchPrompt, location, ...autocompleterProps} = this.props
    const advancedSearchFeatureFlag = isAdvancedSearchOn(location)
    const classNameAdvancedSearchDisabled = advancedSearchFeatureFlag ? 'advanced-search-enabled' : 'advanced-search-disabled'
    return (<div className="card-height">
      <button className="anchor" aria-label="search-card-anchor" id="search-card-anchor" />
      <div id='search-card' className="card double-gap-bottom hidden-print person-search-card">
        <div className="card-header">
          <h2>Snapshot Search</h2>
          {advancedSearchFeatureFlag && <span role='button' className='gap-right search-modal-info' tabIndex="0" onClick={this.handleShowModal} onKeyPress={this.handleKeyPress}>
                      How to Use Snapshot
          </span>}
        </div>
        <div className={`card-body ${classNameAdvancedSearchDisabled}`}>
          <div className="row">
            <div className="col-md-12">
              {!advancedSearchFeatureFlag && <label className='pull-left autocompleter-label' htmlFor='screening_participants'>{searchPrompt}</label>}
              <label className='autocompleter-label' htmlFor='screening_participants'>Search</label>
              <Autocompleter id="screening_participants" {...autocompleterProps} isAdvancedSearchOn={advancedSearchFeatureFlag} />
              { advancedSearchFeatureFlag && <AdvancedSearchForm /> }
            </div>
          </div>
        </div>
      </div>
      {this.state.show && this.renderModal()}
    </div>)
  }
}

PersonSearchForm.propTypes = {
  canCreateNewPerson: PropTypes.bool.isRequired,
  counties: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    value: PropTypes.string,
  })),
  isSelectable: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onBlur: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onLoadMoreResults: PropTypes.func,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  personSearchFields: PersonSearchFieldsPropType,
  results: PropTypes.array,
  searchPrompt: PropTypes.string.isRequired,
  staffId: PropTypes.string,
  states: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  total: PropTypes.number,
}

export {PersonSearchForm}

const PersonSearchFormWithRouter = withRouter(PersonSearchForm)
PersonSearchFormWithRouter.displayName = 'PersonSearchForm'
export default PersonSearchFormWithRouter
