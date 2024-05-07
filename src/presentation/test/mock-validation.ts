import { Validation } from '../protocols'

export const mockValidation = (): any => {
  class ValidationStub implements Validation {
    validate (body: any): Error {
      return null
    }
  }
  return new ValidationStub()
}
