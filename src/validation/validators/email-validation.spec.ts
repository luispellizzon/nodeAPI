import { InvalidParamError } from '../../presentation/errors'
import { EmailValidation } from './email-validation'
import { EmailValidator } from '../protocols/email-validator'

type SutType = {
    sut: EmailValidation,
    emailValidatorStub: EmailValidator,
}
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Email Validation', () => {
  // Test email validator instance
  test('Should call Email Validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'valid@email.com' })
    expect(isValidSpy).toHaveBeenCalledWith('valid@email.com')
  })

  test('Should return error if email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'invalid' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  // Test server error
  test('Should throw if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})
