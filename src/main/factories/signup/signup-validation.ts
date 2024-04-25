import { EmailValidation, CompareFieldsValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFields } from '../../../presentation/types/required-fields'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validators: Validation[] = []
  const requiredFieldsForSignUp: RequiredFields[] = [
    RequiredFields.Name,
    RequiredFields.Email,
    RequiredFields.Password,
    RequiredFields.ConfirmationPassword
  ]
  for (const requiredField of requiredFieldsForSignUp) {
    validators.push(new RequiredFieldValidation(requiredField))
  }
  validators.push(new EmailValidation(RequiredFields.Email, new EmailValidatorAdapter()))
  validators.push(new CompareFieldsValidation(RequiredFields.Password, RequiredFields.ConfirmationPassword))
  return new ValidationComposite(validators)
}
