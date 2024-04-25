import { InvalidParamError } from '../../errors/invalid-param-error'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('password', 'confirmationPassword')
}

describe('Password Confirmation Validation', () => {
  test('Should call PasswordConfirmationValidation with correct values', () => {
    const sut = makeSut()
    const validateSpy = jest.spyOn(sut, 'validate')

    sut.validate({ password: 'any_password', confirmationPassword: 'any_password' })

    expect(validateSpy)
      .toHaveBeenCalledWith({ password: 'any_password', confirmationPassword: 'any_password' })
  })

  // Test confirmation password fails if not equal to password
  test('Should return 400 if password is not equal to confirmation password', async () => {
    const sut = makeSut()
    const error = sut.validate({ password: 'any_password', confirmationPassword: 'different_password' })
    expect(error).toEqual(new InvalidParamError('confirmationPassword'))
  })
})
