import { EmailValidator } from '@/validation/protocols/email-validator'
import { Validation } from '@/presentation/protocols/validation'
import { RequiredFields } from '@/main/factories/types/required-fields'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('@/validation/validators/validation-composite')
const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Login Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validators: Validation[] = []
    const requiredFieldsForSignUp: RequiredFields[] = [
      RequiredFields.Email,
      RequiredFields.Password
    ]
    for (const requiredField of requiredFieldsForSignUp) {
      validators.push(new RequiredFieldValidation(requiredField))
    }
    validators.push(new EmailValidation(RequiredFields.Email, makeEmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validators)
  })
})
