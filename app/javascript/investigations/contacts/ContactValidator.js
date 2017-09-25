import moment from 'moment'

class ContactValidator {
  constructor(contact) {
    this.contact = contact
  }

  validate() {
    const {started_at, status, purpose} = this.contact
    const fields = ['started_at', 'status', 'purpose']
    const errors = fields.reduce(
      (errors, field) => ({...errors, [field]: []}), {}
    )

    if (!started_at) {
      errors.started_at.push('Please enter a contact date')
    }

    const now = moment().toISOString()
    if (started_at > now) {
      errors.started_at.push('The date and time cannot be in the future.')
    }

    if (!status) {
      errors.status.push('Please enter a contact status')
    }

    if (!purpose) {
      errors.purpose.push('Please enter a contact purpose')
    }

    return errors
  }
}

export default ContactValidator