import { InvalidParamError } from '../../errors/invalid-param-error'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Compare Fields Validation', () => {
  test('Should call CompareFieldsValidation with correct values', () => {
    const sut = makeSut()
    const validateSpy = jest.spyOn(sut, 'validate')
    sut.validate({ field: 'any_field', fieldToCompare: 'any_field' })
    expect(validateSpy)
      .toHaveBeenCalledWith({ field: 'any_field', fieldToCompare: 'any_field' })
  })

  // Test confirmation password fails if not equal to password
  test('Should return InvalidParamError if fields are not equal', async () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value', fieldToCompare: 'different_value' })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })
})
