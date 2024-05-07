import { SurveyModel } from '@/domain/models/survey-model'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpsRequest, LoadSurveyById, forbidden, InvalidParamError, serverError } from './save-survey-result-controller-protocols'
import { success } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResult } from '@/domain/use-cases/survey-result/save-survey-result'
import { mockSaveSurveyResult, throwError } from '@/domain/test'
import MockDate from 'mockdate'
import { mockLoadSurveyById, mockSaveSurveyResultStub } from '@/presentation/test/mock-survey-results'

type SutTypes = {
    sut: SaveSurveyResultController,
    loadSurveyById: LoadSurveyById,
    saveSurveyResultStub: SaveSurveyResult,
}

const makeSut = (): SutTypes => {
  const loadSurveyById = mockLoadSurveyById()
  const saveSurveyResultStub = mockSaveSurveyResultStub()
  const sut = new SaveSurveyResultController(loadSurveyById, saveSurveyResultStub)
  return {
    sut,
    loadSurveyById,
    saveSurveyResultStub
  }
}

const makeRequest = ():HttpsRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})

describe('SaveSurveyResultController', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyById } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyById, 'loadById')
    await sut.handle(makeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyById } = makeSut()
    jest.spyOn(loadSurveyById, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(forbidden(new InvalidParamError('survey_id')))
  })

  test('Should return 500 if LoadBSurveyById throws', async () => {
    const { sut, loadSurveyById } = makeSut()
    jest.spyOn(loadSurveyById, 'loadById').mockImplementationOnce(throwError)
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 403 is an invalid answer if provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      params: {
        surveyId: 'any_survey_id"'
      },
      body: {
        answer: 'invalid_answer'
      }
    })
    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSurveySpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeRequest())
    expect(saveSurveySpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(success(mockSaveSurveyResult()))
  })
})
