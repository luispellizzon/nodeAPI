import { SurveyModel } from '../../../domain/models/survey-model'
import { LoadSurveysRepository } from '../../protocols/db/survey/load-survey-repository'
import { DbLoadSurveys } from './db-load-surveys'
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
  test('should call LoadSurveysRepository ', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadRepoSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadRepoSpy).toHaveBeenCalled()
  })
})
