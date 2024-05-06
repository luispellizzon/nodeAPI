import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import MockDate from 'mockdate'

type SutTypes = {
    sut: DbSaveSurveyResult,
    saveSurveyResultRepository: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepository = makeSaveSurveyRepoStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepository)
  return {
    sut,
    saveSurveyResultRepository
  }
}

const makeSaveSurveyRepoStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeSurveyResultData()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSurveyResultData = ():SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeSaveSurveyResultData = ():SaveSurveyResultModel => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date()
})

describe('DbSaveSurveyResult use-case', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    const addRepoSpy = jest.spyOn(saveSurveyResultRepository, 'save')
    await sut.save(makeSaveSurveyResultData())
    expect(addRepoSpy).toHaveBeenCalledWith(makeSaveSurveyResultData())
  })
})
