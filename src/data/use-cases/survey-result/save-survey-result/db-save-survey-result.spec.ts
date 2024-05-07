import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSaveSurveyResult, mockSaveSurveyResultParams, throwError } from '@/domain/test'
import MockDate from 'mockdate'
import { mockSaveSurveyRepository } from '@/data/test'

type SutTypes = {
    sut: DbSaveSurveyResult,
    saveSurveyResultRepository: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepository = mockSaveSurveyRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepository)
  return {
    sut,
    saveSurveyResultRepository
  }
}

describe('DbSaveSurveyResult use-case', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    const addRepoSpy = jest.spyOn(saveSurveyResultRepository, 'save')
    await sut.save(mockSaveSurveyResultParams())
    expect(addRepoSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepository } = makeSut()
    jest.spyOn(saveSurveyResultRepository, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultParams())
    expect(promise).rejects.toThrow()
  })

  test('Should return survey result on success', async () => {
    const { sut } = makeSut()
    const response = await sut.save(mockSaveSurveyResultParams())
    expect(response).toEqual(mockSaveSurveyResult())
  })
})
