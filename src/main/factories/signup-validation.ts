import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFields } from '../../presentation/types/required-fields'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

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
