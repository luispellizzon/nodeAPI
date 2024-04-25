import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFields } from '../../presentation/types/required-fields'

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
  return new ValidationComposite(validators)
}
