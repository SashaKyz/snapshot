import React from 'react'
import {shallow} from 'enzyme'
import NameFields from 'views/advancedSearch/NameFields'

describe('PersonSearchNameGroup', () => {
  describe('layout', () => {
    it('renders last name input field with label Last Name', () => {
      const nameFields = shallow(<NameFields/>)
      const lastName = nameFields.find({name: 'lastName'})
      expect(lastName.exists()).toEqual(true)
    })

    it('renders first name input field with label First Name', () => {
      const nameFields = shallow(<NameFields/>)
      const lastName = nameFields.find({name: 'firstName'})
      expect(lastName.exists()).toEqual(true)
    })

    it('renders middle name input field with label Middle Name', () => {
      const nameFields = shallow(<NameFields/>)
      const lastName = nameFields.find({name: 'middleName'})
      expect(lastName.exists()).toEqual(true)
    })

    it('renders suffix input field with label Suffix', () => {
      const nameFields = shallow(<NameFields/>)
      const lastName = nameFields.find({name: 'suffix'})
      expect(lastName.exists()).toEqual(true)
    })
  })
})
