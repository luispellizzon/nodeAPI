import { RequiredFields } from '../../types/required-fields'
import { EmailValidation } from './email-validation'
import { Validation } from './validation'

export class ValidationComposite implements Validation {
  private readonly validators:Validation[]
  constructor (validators: Validation[]) {
    this.validators = validators
  }

  validate (input: any): Error {
    for (const validation of this.validators) {
      const isError = validation.validate(input)
      if (isError) return isError
    }
  }
}
