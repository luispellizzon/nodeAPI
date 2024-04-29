import { AddSurveyController } from './add-survey-controller'
import { Validation } from './add-survey-controller-protocols'

type SutTypes = {
    sut: AddSurveyController,
    validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub)
  return {
    sut,
    validationStub
  }
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeRequest = () => ({
  body: {
    question: 'any_question',
    answers: [{
      icon: 'any_image',
      answer: 'any_answer'
    }]
  }
})

describe('Add Survey', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
