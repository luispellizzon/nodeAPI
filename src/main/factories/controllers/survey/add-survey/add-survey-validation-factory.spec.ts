import { RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { SurveyRequiredFields } from '../../../types/survey-fields'

jest.mock('../../../../../validation/validators/validation-composite')

describe('Add Survey Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validators: Validation[] = []
    const requiredFieldsForSignUp: SurveyRequiredFields[] = [
      SurveyRequiredFields.Question,
      SurveyRequiredFields.Answers
    ]
    for (const requiredField of requiredFieldsForSignUp) {
      validators.push(new RequiredFieldValidation(requiredField))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validators)
  })
})
