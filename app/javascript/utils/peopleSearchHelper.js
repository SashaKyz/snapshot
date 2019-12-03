import {Map, List, fromJS} from 'immutable'
import {buildSelector} from 'selectors'
import {
  selectAddressTypes,
  selectEthnicityTypes,
  selectHispanicOriginCodes,
  selectLanguages,
  selectRaceTypes,
  selectUnableToDetermineCodes,
  systemCodeDisplayValue,
} from 'selectors/systemCodeSelectors'
import {zipFormatter} from '../utils/zipFormatter'
import {isPlacementHome} from './isPlacementHome'
import {RESIDENCE_TYPE} from 'enums/AddressType'
import {Maybe} from 'utils/maybe'

export const mapLanguages = (state, result) => buildSelector(
  selectLanguages,
  () => (result.get('languages') || List()),
  (statusCodes, languages) => (
    languages
      .sort((first, second) => second.get('primary') - first.get('primary'))
      .map((language) => (
        systemCodeDisplayValue(language.get('id'), statusCodes))
      )

  )
)(state)

export const mapIsSensitive = (result) => ((result.get('sensitivity_indicator') || '').toUpperCase() === 'S')
export const mapIsSealed = (result) => ((result.get('sensitivity_indicator') || '').toUpperCase() === 'R')
export const mapIsProbationYouth = (result) => ((result.get('open_case_responsible_agency_code') || '').toUpperCase() === 'P')

export const mapRaces = (state, result) => buildSelector(
  selectEthnicityTypes,
  selectRaceTypes,
  selectUnableToDetermineCodes,
  () => (result.getIn(['race_ethnicity', 'race_codes']) || List()),
  () => result.get('unable_to_determine_code'),
  (ethnicityTypes, raceTypes, unableToDetermineCodes, races, unableToDetermineCode) => {
    if (unableToDetermineCode) {
      return List([systemCodeDisplayValue(unableToDetermineCode, unableToDetermineCodes)])
    } else {
      return races
        .map((race) => (Map({
          race: systemCodeDisplayValue(race.get('id'), raceTypes),
          race_detail: systemCodeDisplayValue(race.get('id'), ethnicityTypes),
        })))
    }
  }
)(state)

export const mapEthnicities = (state, result) => buildSelector(
  selectHispanicOriginCodes,
  () => (result.getIn(['race_ethnicity', 'hispanic_codes']) || List()),
  () => (result.getIn(['race_ethnicity', 'hispanic_origin_code'])),
  (hispanicOriginCodes, ethnicities, hispanicLatinoOriginCode) => fromJS({
    hispanic_latino_origin: systemCodeDisplayValue(hispanicLatinoOriginCode, hispanicOriginCodes),
    ethnicity_detail: ethnicities.map((ethnicity) => ethnicity.get('description')).toJS(),
  })
)(state)

const getStreetAddress = (address) =>
  `${address.get('street_number') || ''} ${address.get('street_name') || ''}`

const getDisplayType = (address, addressTypes) => {
  if (isPlacementHome(address)) {
    return 'Placement Home'
  } else {
    return systemCodeDisplayValue(address.getIn(['type', 'id']), addressTypes) || ''
  }
}

const isResidence = (address) => address.getIn(['type', 'id']) === RESIDENCE_TYPE

export const mapAddress = (state, result) => {
  const addressTypes = selectAddressTypes(state)

  return Maybe.of(result.get('addresses'))
    .map((as) => as.first())
    .filter(isResidence)
    .map((address) => Map({
      city: address.get('city'),
      state: address.get('state_code'),
      zip: zipFormatter(address.get('zip')),
      streetAddress: getStreetAddress(address),
      type: getDisplayType(address, addressTypes),
    })).valueOrElse(null)
}

export const mapPhoneNumber = (result) =>
  Maybe.of(result.get('addresses'))
    .map((as) => as.first())
    .filter(isResidence)
    .map((address) => address.get('phone_numbers'))
    .valueOrElse(List())
