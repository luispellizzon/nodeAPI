import { mockLoadSurveysRepository } from '@/data/test'
import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository } from './db-load-surveys-protocols'
import { mockSurveyModel, throwError } from '@/domain/test'
import MockDate from 'mockdate'

type SutTypes = {
    sut: DbLoadSurveys,
    loadSurveysRepositoryStub : LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

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
    expect(response).toEqual([mockSurveyModel()])
  })

  test('should throw a LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load()
    expect(promise).rejects.toThrow()
  })
})
