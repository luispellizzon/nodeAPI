import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))
const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter()
describe('Email Validator Adapter', () => {
  test('Must return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const emailValue = 'invalid_email@email.com'
    const isValid = sut.isValid(emailValue)
    expect(isValid).toBe(false)
  })
  test('Must return TRUE if validator returns TRUE', () => {
    const sut = makeSut()
    const emailValue = 'valid_email@email.com'
    const isValid = sut.isValid(emailValue)
    expect(isValid).toBe(true)
  })
  test('Must call validator with valid email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const emailValue = 'valid_email@email.com'
    sut.isValid(emailValue)
    expect(isEmailSpy).toHaveBeenCalledWith(emailValue)
  })
})
