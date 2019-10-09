import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  clientId: Yup.string()
    .matches(/\d{4}-\d{4}-\d{4}-\d{7}/, {message: 'Client ID number must be 19 digits long.', excludeEmptyString: true}),
  ssn: Yup.string()
    .matches(/\d{3}-\d{2}-\d{4}/, {message: 'Social security number must be 9 digits long.', excludeEmptyString: true})
    .matches(/(?!0{3})[\d_]{3}-(?!0{2})[\d_]{0,2}-(?!0{4})[\d_]{0,4}/, {message: 'Social security number cannot contain all 0s in a group.', excludeEmptyString: true}),
  'dateOfBirth': Yup.date()
    .nullable()
    .max(new Date(), 'Please enter date as today or earlier')
    .typeError('Please enter a date in the format of MM/DD/YYYY')
})

export {validationSchema}
