import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFields } from '../../../presentation/types/required-fields'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validators: Validation[] = []
  const requiredFieldsForSignUp: RequiredFields[] = [
    RequiredFields.Email,
    RequiredFields.Password
  ]
  for (const requiredField of requiredFieldsForSignUp) {
    validators.push(new RequiredFieldValidation(requiredField))
  }
  validators.push(new EmailValidation(RequiredFields.Email, new EmailValidatorAdapter()))
  return new ValidationComposite(validators)
}
