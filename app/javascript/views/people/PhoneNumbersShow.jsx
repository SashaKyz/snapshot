import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'
import {PhoneNumberPropType} from 'data/address'

const PhoneNumbersShow = ({phoneNumbers}) => (
  <div>
    {phoneNumbers.map(({number, type, extension, errors}, index) => (
      <div key={index}>
        <div className="row gap-top">
          <ShowField
            gridClassName="col-md-4"
            label="Phone Number"
            errors={errors}
          >
            <p x-ms-format-detection="none">
              {number}
            </p>
          </ShowField>
          <ShowField gridClassName="col-md-4" label="Extension">
            {extension}
          </ShowField>
          <ShowField gridClassName="col-md-4" label="Phone Number Type">
            {type}
          </ShowField>
        </div>
      </div>
    ))}
  </div>
)

PhoneNumbersShow.propTypes = {
  phoneNumbers: PropTypes.arrayOf(PhoneNumberPropType),
}

export default PhoneNumbersShow
