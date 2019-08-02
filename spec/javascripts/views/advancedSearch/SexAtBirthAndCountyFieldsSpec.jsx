import React from 'react'
import {shallow} from 'enzyme'
import {ErrorMessage} from 'formik'
import SexAtBirthAndCountyFields from 'views/advancedSearch/SexAtBirthAndCountyFields'

describe('SexAtBirthAndCountyFields', () => {
  it('renders a sex at birth select field that renders all the genders', () => {
    const sexAtBirthAndCountyFields = shallow(<SexAtBirthAndCountyFields />)
    const genderField = sexAtBirthAndCountyFields.find({name: 'gender', id: 'search-sex-at-birth'})
    const select = genderField.renderProp('render')({field: {}})
    const options = select.find('option')
    expect(options.map(option => option.text())).toEqual([
      '',
      'Male',
      'Female',
      'Intersex',
      'Unknown',
    ])
  })

  it('renders a county select field that renders all the counties', () => {
    const sexAtBirthAndCountyFields = shallow(<SexAtBirthAndCountyFields />)
    const genderField = sexAtBirthAndCountyFields.find({name: 'county', id: 'search-county'})
    const select = genderField.renderProp('render')({field: {}})
    const options = select.find('option')
    expect(options.map(option => option.text())).toEqual([
      '',
      'Alameda',
      'Alpine',
      'Amador',
      'Butte',
      'Calaveras',
      'Colusa',
      'Contra Costa',
      'Del Norte',
      'El Dorado',
      'Fresno',
      'Glenn',
      'Humboldt',
      'Imperial',
      'Inyo',
      'Kern',
      'Kings',
      'Lake',
      'Lassen',
      'Los Angeles',
      'Madera',
      'Marin',
      'Mariposa',
      'Mendocino',
      'Merced',
      'Modoc',
      'Mono',
      'Monterey',
      'Napa',
      'Nevada',
      'Orange',
      'Placer',
      'Plumas',
      'Riverside',
      'Sacramento',
      'San Benito',
      'San Bernardino',
      'San Diego',
      'San Francisco',
      'San Joaquin',
      'San Luis Obispo',
      'San Mateo',
      'Santa Barbara',
      'Santa Clara',
      'Santa Cruz',
      'Shasta',
      'Sierra',
      'Siskiyou',
      'Solano',
      'Sonoma',
      'Stanislaus',
      'Sutter',
      'Tehama',
      'Trinity',
      'Tulare',
      'Tuolumne',
      'Ventura',
      'Yolo',
      'Yuba',
    ])
  })

  it('renders errors for sex at birth select field', () => {
    const sexAtBirthAndCountyFields = shallow(<SexAtBirthAndCountyFields />)
    const errors = sexAtBirthAndCountyFields.find(ErrorMessage).filter({name: 'gender'})
    expect(errors.exists()).toEqual(true)
  })

  it('renders errors for county select field', () => {
    const sexAtBirthAndCountyFields = shallow(<SexAtBirthAndCountyFields />)
    const errors = sexAtBirthAndCountyFields.find(ErrorMessage).filter({name: 'county'})
    expect(errors.exists()).toEqual(true)
  })
})
