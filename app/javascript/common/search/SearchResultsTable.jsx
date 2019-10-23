import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {dateFormatter} from 'utils/dateFormatter'
import {capitalizedStr} from 'utils/textFormatter'
import ReactTooltip from 'react-tooltip'
import {phoneNumberFormatter} from 'utils/phoneNumberFormatter'
import AlertMessageResultsLimit from 'common/search/AlertMessageResultsLimit'
import DateOfBirthTableHeader from 'common/search/DateOfBirthTableHeader'
import CountyTableHeader from 'common/search/CountyTableHeader'
import InfoMessage from 'common/search/InfoMessage'
import {removeHtmlTags} from 'utils/textFormatter'
import * as Analytics from 'utils/analytics'

const commonStyle = {headerClassName: 'search-results-header'}

class SearchResultsTable extends React.Component {
  columns = (onAuthorize, staffId, county) => [
    {
      Header: '',
      id: 'row',
      maxWidth: 50,
      filterable: false,
      className: 'search-results',
      Cell: (row) => {
        return `${row.index + 1}.`
      },
    },
    {
      id: 'name',
      Header: 'Name',
      accessor: 'fullName',
      Cell: (row) => {
        const person = row.original
        const id = person.legacyDescriptor && person.legacyDescriptor.legacy_id
        const akaFullName = person.akaFullName
        const personFullName = person.fullName && removeHtmlTags(person.fullName)
        return (
          <div>
            {person.isSensitive && <span data-tip="Sensitive" data-for="Sensitive">&nbsp;<i className="fa fa-shield search-information-flag" aria-hidden="true"/></span>}
            <ReactTooltip id='Sensitive' className="custom-tool-tip" />
            {person.isSealed && <span data-tip="Sealed" data-for="Sealed">&nbsp;<i className="fa fa-eye-slash search-information-flag" aria-hidden="true"/></span>}
            <ReactTooltip id='Sealed' className="custom-tool-tip" />
            <button className='person-search-detail-link' onClick={
              () => {
                Analytics.logEvent('searchResultClick', {staffId, staff_county: county})
                onAuthorize(id)
              }}
            >
              {personFullName}
            </button>
            <span>{akaFullName}</span>
          </div>
        )
      },
      ...commonStyle,
    },
    {
      Header: <DateOfBirthTableHeader />,
      accessor: 'dateOfBirth',
      Cell: (row) => {
        const isApproximateAge = row.original.isApproximateAge
        const dateOfBirth = row.original.dateOfBirth
        return isApproximateAge === 'Y' ? `~${dateFormatter(dateOfBirth)}` : dateFormatter(dateOfBirth)
      },
      ...commonStyle,
    },
    {
      Header: 'Sex at Birth',
      accessor: 'gender',
      Cell: (row) => capitalizedStr(row.original.gender),
      ...commonStyle,
    },
    {
      id: 'address',
      Header: 'Address',
      accessor: (result) => {
        const address = result.address
        return address ?
          `${address.streetAddress}, ${address.city}, ${address.state} ${address.zip}` :
          ''
      },
      ...commonStyle,
    },
    {
      Header: 'Case Status',
      accessor: 'caseStatus',
      ...commonStyle,
    },
    {
      Header: <CountyTableHeader />,
      accessor: 'spCounty',
      ...commonStyle,
    },
    {
      Header: "Staff Person's Phone",
      accessor: 'spPhone',
      Cell: (row) =>
        <div x-ms-format-detection="none">
          {phoneNumberFormatter(row.original.spPhone)}
        </div>,
      ...commonStyle,
    },
  ]

  render() {
    const {results, total, onAuthorize, staffId, county} = this.props
    const onPageChange = () => ReactTooltip.rebuild()
    return (
      <Fragment>
        <AlertMessageResultsLimit total={total} />
        <InfoMessage total={results.length} />
        {results.length > 0 &&
        <ReactTable
          columns={this.columns(onAuthorize, staffId, county)}
          data={results}
          minRows={0}
          defaultPageSize={25}
          onPageChange={onPageChange}
        />}
      </Fragment>
    )
  }
}

SearchResultsTable.propTypes = {
  county: PropTypes.string,
  onAuthorize: PropTypes.func,
  personSearchFields: PropTypes.object,
  results: PropTypes.array,
  staffId: PropTypes.string,
  total: PropTypes.number,
}

export default SearchResultsTable
