import React from 'react'
import PropTypes from 'prop-types'
import {PersonSearchFieldsDefaultProps} from 'data/personSearch'

const LoadingIndicator = <i aria-label='spinner' className='fa fa-spinner fa-spin-faster' />

const PersonSearchButtonGroup = ({
  onSubmit,
  onCancel,
  canSearch,
  total,
}) => (
  <div className="row person-search-button-group">
    <div className="col-md-12">
      <button
        className="btn person-search-button search"
        onClick={onSubmit}
        disabled={!canSearch}
      >
        {total === null ? LoadingIndicator : 'Search'}
      </button>
      <button
        className="btn person-search-button clear"
        onClick={onCancel}
      >
        Clear
      </button>
    </div>
  </div>
)

PersonSearchButtonGroup.propTypes = {
  canSearch: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  total: PropTypes.number,
}

PersonSearchButtonGroup.defaultProps = PersonSearchFieldsDefaultProps

export default PersonSearchButtonGroup
