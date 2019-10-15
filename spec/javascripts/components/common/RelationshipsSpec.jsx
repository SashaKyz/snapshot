import React from 'react'
import AttachLink from 'common/relationship/AttachLink'
import {shallow} from 'enzyme'
import {EmptyRelationships, Relationships} from 'common/Relationships'

describe('Relationships for Snapshot', () => {
  const onClick = jasmine.createSpy('onClick')
  const county = 'county'
  const renderRelationships = props =>
    shallow(
      <Relationships {...props} isScreening={false} onClick={onClick} county={county} />,
      {disableLifecycleMethods: true}
    )

  it('renders people with no relationships', () => {
    const people = [
      {name: 'Sally Jones', relationships: []},
      {name: 'Nate Starbringer', relationships: []},
      {name: 'Jim Johnson', relationships: []},
    ]
    const component = renderRelationships({people})

    expect(
      component
        .find('.person')
        .at(0)
        .text()
    ).toEqual('Sally Jones')
    expect(
      component
        .find('.person')
        .at(1)
        .text()
    ).toEqual('Nate Starbringer')
    expect(
      component
        .find('.person')
        .at(2)
        .text()
    ).toEqual('Jim Johnson')
  })

  it('renders relationships for each person', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
      {
        name: 'Nate Starbringer',
        relationships: [
          {
            name: 'Jim Johnson',
            type: 'father',
            person_card_exists: false,
            legacy_descriptor: {legacy_id: '2'},
          },
        ],
      },
      {
        name: 'Jim Johnson',
        relationships: [
          {
            name: 'Nate Starbringer',
            type: 'son',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '4'},
          },
          {
            name: 'Sally Jones',
            type: 'daughter',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '3'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    }).find(AttachLink)
    expect(component.length).toBe(4)
    expect(component.at(0).prop('county')).toEqual('county')
    expect(component.at(0).prop('relationship')).toEqual({
      name: 'Jane Johnson',
      type: 'mother',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '1'},
    })
    expect(component.at(1).prop('relationship')).toEqual({
      name: 'Jim Johnson',
      type: 'father',
      person_card_exists: false,
      legacy_descriptor: {legacy_id: '2'},
    })
    expect(component.at(2).prop('relationship')).toEqual({
      name: 'Nate Starbringer',
      type: 'son',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '4'},
    })
    expect(component.at(3).prop('relationship')).toEqual({
      name: 'Sally Jones',
      type: 'daughter',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '3'},
    })
  })

  it('renders relationships with sealed information flag when isSealed is true', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            isSealed: true,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    })
    expect(
      component
        .find(AttachLink)
        .at(0)
        .prop('relationship')
    ).toEqual({
      name: 'Jane Johnson',
      type: 'mother',
      person_card_exists: true,
      isSealed: true,
      legacy_descriptor: {legacy_id: '1'},
    })
    expect(component.at(0).html()).toContain(
      '<span class="information-flag search-result">Sealed</span>'
    )
  })

  it('does not renders relationships with sealed information flag when isSealed is false', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            isSealed: false,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    })
    expect(
      component
        .find(AttachLink)
        .at(0)
        .prop('relationship')
    ).toEqual({
      name: 'Jane Johnson',
      type: 'mother',
      person_card_exists: true,
      isSealed: false,
      legacy_descriptor: {legacy_id: '1'},
    })
    expect(component.at(0).html()).not.toContain(
      '<span class="information-flag search-result">Sealed</span>'
    )
  })

  it('renders relationships with sensitive information flag when isSensitive is true', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            isSensitive: true,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    })
    expect(
      component
        .find(AttachLink)
        .at(0)
        .prop('relationship')
    ).toEqual({
      name: 'Jane Johnson',
      type: 'mother',
      person_card_exists: true,
      isSensitive: true,
      legacy_descriptor: {legacy_id: '1'},
    })
    expect(component.at(0).html()).toContain(
      '<span class="information-flag search-result">Sensitive</span>'
    )
  })

  it('does not renders relationships with sensitive information flag when isSensitive is false', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            isSensitive: false,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    })
    expect(
      component
        .find(AttachLink)
        .at(0)
        .prop('relationship')
    ).toEqual({
      name: 'Jane Johnson',
      type: 'mother',
      person_card_exists: true,
      isSensitive: false,
      legacy_descriptor: {legacy_id: '1'},
    })
    expect(component.at(0).html()).not.toContain(
      '<span class="information-flag search-result">Sealed</span>'
    )
  })
  it('renders Age & Age_Units for each person', () => {
    const participants = []
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            age: '(30 yrs)',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
      {
        name: 'Nate Starbringer',
        relationships: [
          {
            name: 'Jim Johnson',
            type: 'father',
            age: '(30 yrs)',
            person_card_exists: false,
            legacy_descriptor: {legacy_id: '2'},
          },
        ],
      },
      {
        name: 'Jim Johnson',
        relationships: [
          {
            name: 'Nate Starbringer',
            type: 'son',
            age: '(20 yrs)',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '4'},
          },
          {
            name: 'Sally Jones',
            type: 'daughter',
            age: '(10 yrs)',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '3'},
          },
        ],
      },
    ]
    const component = renderRelationships({
      people,
      participants,
      pendingPeople,
    }).find(AttachLink)

    expect(component.length).toBe(4)
    expect(component.at(0).prop('relationship')).toEqual({
      name: 'Jane Johnson',
      type: 'mother',
      age: '(30 yrs)',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '1'},
    })
    expect(component.at(1).prop('relationship')).toEqual({
      name: 'Jim Johnson',
      type: 'father',
      age: '(30 yrs)',
      person_card_exists: false,
      legacy_descriptor: {legacy_id: '2'},
    })
    expect(component.at(2).prop('relationship')).toEqual({
      name: 'Nate Starbringer',
      type: 'son',
      age: '(20 yrs)',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '4'},
    })
    expect(component.at(3).prop('relationship')).toEqual({
      name: 'Sally Jones',
      type: 'daughter',
      age: '(10 yrs)',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '3'},
    })
  })

  it('hides Attach link for people in the pending list', () => {
    const participants = []
    const pendingPeople = ['1']
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
      {
        name: 'Nate Starbringer',
        relationships: [
          {
            name: 'Jim Johnson',
            type: 'father',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '2'},
          },
        ],
      },
    ]
    const attachLinks = renderRelationships({
      people,
      participants,
      pendingPeople,
    }).find(AttachLink)

    expect(attachLinks.length).toBe(2)
    expect(attachLinks.at(0).prop('relationship')).toEqual({
      name: 'Jane Johnson',
      type: 'mother',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '1'},
    })
    expect(attachLinks.at(1).prop('relationship')).toEqual({
      name: 'Jim Johnson',
      type: 'father',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '2'},
    })
    expect(
      attachLinks
        .at(0)
        .dive()
        .find('a')
        .exists()
    ).toBe(false)
    expect(
      attachLinks
        .at(1)
        .dive()
        .find('a')
        .exists()
    ).toBe(true)
  })

  it('hides Attach link for people in the participants list', () => {
    const participants = ['2']
    const pendingPeople = []
    const people = [
      {
        name: 'Sally Jones',
        relationships: [
          {
            name: 'Jane Johnson',
            type: 'mother',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '1'},
          },
        ],
      },
      {
        name: 'Nate Starbringer',
        relationships: [
          {
            name: 'Jim Johnson',
            type: 'father',
            person_card_exists: true,
            legacy_descriptor: {legacy_id: '2'},
          },
        ],
      },
    ]

    const attachLinks = renderRelationships({
      people,
      participants,
      pendingPeople,
    }).find(AttachLink)

    expect(attachLinks.length).toBe(2)
    expect(attachLinks.at(0).prop('relationship')).toEqual({
      name: 'Jane Johnson',
      type: 'mother',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '1'},
    })
    expect(attachLinks.at(1).prop('relationship')).toEqual({
      name: 'Jim Johnson',
      type: 'father',
      person_card_exists: true,
      legacy_descriptor: {legacy_id: '2'},
    })
    expect(
      attachLinks
        .at(0)
        .dive()
        .find('a')
        .exists()
    ).toBe(true)
    expect(
      attachLinks
        .at(1)
        .dive()
        .find('a')
        .exists()
    ).toBe(false)
  })
})

describe('EmptyRelationships', () => {
  it('renders a reminder to add people when there are no relationships', () => {
    const component = shallow(<EmptyRelationships />, {
      disableLifecycleMethods: true,
    })
    expect(component.find('.empty-relationships').text()).toEqual(
      'Search for people and add them to see their relationships.'
    )
  })
})
