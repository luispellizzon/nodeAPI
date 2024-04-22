import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('Email Validator Adapter', () => {
  test('Must return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const emailValue = 'invalid_email@email.com'
    const isValid = sut.isValid(emailValue)
    expect(isValid).toBe(false)
  })
  test('Must return TRUE if validator returns TRUE', () => {
    const sut = new EmailValidatorAdapter()
    const emailValue = 'invalid_email@email.com'
    const isValid = sut.isValid(emailValue)
    expect(isValid).toBe(true)
  })
})
