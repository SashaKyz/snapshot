import React from 'react'
import {shallow} from 'enzyme'
import Footer from 'views/Footer'

describe('Footer', () => {
  let component
  beforeEach(() => {
    component = shallow(<Footer />)
  })

  it('renders className link-color', () => {
    expect(component.find('div.link-color').exists()).toBe(true)
  })

  it('renders an invisible header for accessibility outline', () => {
    const header = component.find('h2')
    expect(header.exists()).toEqual(true)
    expect(header.props().className).toEqual('hidden')
  })
})
