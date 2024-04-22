import { EmailValidatorAdapter } from './email-validator-adapter'
describe('Email Validator Adapter', () => {
  test('Must return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    const emailValue = 'invalid_email@email.com'
    const isValid = sut.isValid(emailValue)
    expect(isValid).toBe(false)
  })
})
