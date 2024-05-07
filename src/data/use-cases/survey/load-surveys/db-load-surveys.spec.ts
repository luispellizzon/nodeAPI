import { DbLoadSurveys } from './db-load-surveys'
import { SurveyModel, LoadSurveysRepository } from './db-load-surveys-protocols'
import { throwError } from '@/domain/test'
import MockDate from 'mockdate'

type SutTypes = {
    sut: DbLoadSurveys,
    loadSurveysRepositoryStub : LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = makeLoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

const makeLoadSurveysRepositoryStub = () => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    loadAll (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(makeFakeSurveys()))
    }
  }
  return new LoadSurveysRepositoryStub()
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

describe('Db Load Surveys', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  test('should call LoadSurveysRepository ', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadRepoSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadRepoSpy).toHaveBeenCalled()
  })

  test('should return a list of surveys on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load()
    expect(response).toEqual(makeFakeSurveys())
  })

  test('should throw a LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    expect(promise).rejects.toThrow()
  })
})
