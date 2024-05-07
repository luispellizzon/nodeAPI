import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from './db-save-survey-result-protocols'
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
    save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeSurveyResultData()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}

const makeSaveSurveyResultData = ():SaveSurveyResultParams => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeSurveyResultData = (): SurveyResultModel => (Object.assign({}, makeSaveSurveyResultData(), { id: 'any_id' }))

describe('DbSaveSurveyResult use-case', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    const addRepoSpy = jest.spyOn(saveSurveyResultRepository, 'save')
    await sut.save(makeSaveSurveyResultData())
    expect(addRepoSpy).toHaveBeenCalledWith(makeSaveSurveyResultData())
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    jest.spyOn(saveSurveyResultRepository, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.save(makeSaveSurveyResultData())
    expect(promise).rejects.toThrow()
  })

  test('Should return survey result on success', async () => {
    const { sut } = makeSut()
    const response = await sut.save(makeSaveSurveyResultData())
    expect(response).toEqual(makeSurveyResultData())
  })
})
