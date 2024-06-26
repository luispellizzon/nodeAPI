import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys } from './load-surveys-controller-protocols'
import { noContent, serverError, success } from '@/presentation/helpers/http/http-helper'
import { throwError } from '@/domain/test'
import MockDate from 'mockdate'
import { mockLoadSurveys } from '@/presentation/test'

type SutTypes = {
  sut: LoadSurveysController,
  loadSurveysStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurveys()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

const makeFakeSurveys = () => ([
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        icon: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
])

describe('Load Surveys Controller', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())
  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSurveySpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSurveySpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(success(makeFakeSurveys()))
  })

  test('Should return 500 on LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const response = await sut.handle({})
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 204 if there is no surveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const response = await sut.handle({})
    expect(response).toEqual(noContent())
  })
})
