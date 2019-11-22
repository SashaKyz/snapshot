import React from 'react'
import {shallow} from 'enzyme'
import SnapshotSideBar from 'snapshots/SnapshotSideBar'

describe('SnapshotSideBar', () => {
  let component
  const participants = [{id: '23', first_name: 'Ultra', last_name: 'Goku', middle_name: '', name_suffix: ''}]
  beforeEach(() => {
    component = shallow(<SnapshotSideBar participants={participants} />)
  })

  it('renders the div wrapper', () => {
    expect(component.find('div.col-md-3.col-xs-3.col-sm-3').exists()).toBe(true)
  })

  it('renders an invisible header for accessibility outline', () => {
    const header = component.find('h2')
    expect(header.exists()).toEqual(true)
    expect(header.props().className).toEqual('hidden')
  })

  it('renders the SideBar component', () => {
    expect(component.find('SideBar').exists()).toBe(true)
  })

  it('renders People & Roles', () => {
    const sidebarPeople = component.find('SideBarPeople')
    expect(sidebarPeople.exists()).toEqual(true)
    expect(sidebarPeople.props().participants).toEqual(participants)
  })

  it('renders a link to the Relationships card', () => {
    expect(component.find('NavLink[text="Relationships"]').props().href)
      .toBe('#relationships-card-anchor')
  })

  it('renders a link to the History card', () => {
    expect(component.find('NavLink[text="History"]').props().href)
      .toBe('#history-card-anchor')
  })
})
