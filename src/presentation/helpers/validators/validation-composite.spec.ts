import { MissingParamError } from '../../errors'
import { RequiredFields } from '../../types/required-fields'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeSut = () => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return new MissingParamError('field')
    }
  }
  return new ValidationComposite([new ValidationStub()])
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_field' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return falsy if validation succeeds', () => {

  })
})
