import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'
import { noContent, serverError, success } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'

type SutTypes = {
  sut: LoadSurveysController,
  loadSurveysStub: LoadSurveys
}
const makeSut = (): SutTypes => {
  const loadSurveysStub = makeLoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

const makeLoadSurveysStub = () => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysStub()
}

const makeFakeSurveys = () => ([
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        image: 'any_image',
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
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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