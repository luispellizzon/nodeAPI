import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { RequiredFields } from '../../../presentation/types/required-fields'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')
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
