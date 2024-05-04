import { Validation } from '@/presentation/protocols/validation'

export class ValidationComposite implements Validation {
  constructor (private readonly validators: Validation[]) {
    this.validators = validators
  }

  validate (input: any): Error {
    for (const validation of this.validators) {
      const isError = validation.validate(input)
      if (isError) return isError
    }
  }
}
