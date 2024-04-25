import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeRequest = () => ({
  body: {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    confirmationPassword: 'any_password'
  }
})

describe('Required Field Validation', () => {
  test('Should return MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('different_field')
    const request = makeRequest()
    const error = sut.validate(request.body)
    expect(error).toEqual(new MissingParamError('different_field'))
  })

  test('Should return falsy if validation succeeds', () => {
    const sut = new RequiredFieldValidation('name')
    const request = makeRequest()
    const error = sut.validate(request.body)
    expect(error).toBeFalsy()
  })
})
