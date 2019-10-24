import React from 'react'
import PropTypes from 'prop-types'
import CardView from 'views/CardView'
import {SHOW_MODE} from 'actions/snapshotActions'
import SearchResultsTable from 'common/search/SearchResultsTable'

const PersonSearchResults = (
  {
    total,
    personSearchFields,
    results,
    onAuthorize,
    isSearchResults,
    staffId,
    county,
  }) => {
  const resultsLimit = 250
  const totalResults = total > resultsLimit ? '250+' : total
  const title = totalResults == null ? '' : `Search Results (${totalResults} records found)`
  return (
    isSearchResults &&
    <CardView
      id="person-search-results-card"
      title={title}
      mode={SHOW_MODE}
      show={
        <SearchResultsTable
          results={results}
          total={total}
          personSearchFields={personSearchFields}
          onAuthorize={onAuthorize}
          staffId={staffId}
          county={county}
        />
      }
    />
  )
}

PersonSearchResults.propTypes = {
  onAuthorize: PropTypes.func,
  personSearchFields: PropTypes.object,
  results: PropTypes.array,
  total: PropTypes.number,
}

export default PersonSearchResults
