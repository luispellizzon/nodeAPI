import { RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { SurveyRequiredFields } from '../../types/survey-fields'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validators: Validation[] = []
  const requiredFieldsForSignUp: SurveyRequiredFields[] = [
    SurveyRequiredFields.Question,
    SurveyRequiredFields.Answers
  ]
  for (const requiredField of requiredFieldsForSignUp) {
    validators.push(new RequiredFieldValidation(requiredField))
  }
  return new ValidationComposite(validators)
}
