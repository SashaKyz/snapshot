import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  ssn: Yup.string()
    .matches(/\d{3}-\d{2}-\d{4}/, {message: 'Social security number must be 9 digits long.', excludeEmptyString: true})
    .matches(/(?!0{3})\d{3}-(?!0{2})\d{2}-(?!0{4})\d{4}/, {message: 'Social security number cannot contain all 0s in a group.', excludeEmptyString: true}),
  'dateOfBirth': Yup.date()
    .nullable()
    .max(new Date(), 'Please enter date as today or earlier'),
})

export {validationSchema}
