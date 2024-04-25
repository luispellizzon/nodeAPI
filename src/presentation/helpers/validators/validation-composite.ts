import { Validation } from './validation'

export class ValidationComposite implements Validation {
  private readonly validations:Validation[]
  constructor (validations: Validation[]) {
    this.validations = validations
  }

  validate (input: any): Error {
    for (const validation of this.validations) {
      const isError = validation.validate(input)
      if (isError) return isError
    }
  }
}
