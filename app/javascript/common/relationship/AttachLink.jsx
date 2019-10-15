import React from 'react'
import PropTypes from 'prop-types'
import {logEvent} from 'utils/analytics'

const attachLink = (onClick, relationship, county) => (
  <a
    href="#relationships-list"
    aria-label="Attach Relationship"
    className="hidden-print"
    onClick={() => {
      logEvent('Attach', {
        staff_county: county,
      })
      onClick(relationship)
    }}
  >
    &nbsp;Attach
  </a>
)

const isPending = (relationship, pendingPeople) =>
  pendingPeople.some(
    id =>
      id ===
      (relationship.legacy_descriptor &&
        relationship.legacy_descriptor.legacy_id)
  )

const isParticipant = (relationship, participants) =>
  participants.some(
    id =>
      id ===
      (relationship.legacy_descriptor &&
        relationship.legacy_descriptor.legacy_id)
  )

export const AttachLink = ({
  isScreening,
  onClick,
  participants = [],
  pendingPeople,
  relationship,
  screeningId,
  county,
}) => {
  if (
    relationship.person_card_exists &&
    !isPending(relationship, pendingPeople) &&
    !isParticipant(relationship, participants)
  ) {
    return attachLink(onClick, relationship, county)
  } else {
    return null
  }
}

AttachLink.propTypes = {
  isScreening: PropTypes.bool,
  onClick: PropTypes.func,
  participants: PropTypes.arrayOf(PropTypes.string),
  pendingPeople: PropTypes.arrayOf(PropTypes.string),
  relationship: PropTypes.object,
  screeningId: PropTypes.string,
}

export default AttachLink
