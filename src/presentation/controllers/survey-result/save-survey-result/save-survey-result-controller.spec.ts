import { SurveyModel } from '@/domain/models/survey-model'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpsRequest, LoadSurveyById, forbidden, InvalidParamError, serverError } from './save-survey-result-controller-protocols'
import { success } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import MockDate from 'mockdate'

type SutTypes = {
    sut: SaveSurveyResultController,
    loadSurveyById: LoadSurveyById,
    saveSurveyResultStub: SaveSurveyResult,
}

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyByIdStub()
  const saveSurveyResultStub = makeSaveSurveyResultStub()
  const sut = new SaveSurveyResultController(loadSurveyById, saveSurveyResultStub)
  return {
    sut,
    loadSurveyById,
    saveSurveyResultStub
  }
}

const makeLoadSurveyByIdStub = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (surveyId: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeSurveyData()))
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeSurveyResultData()))
    }
  }
  return new SaveSurveyResultStub()
}

const makeSurveyData = ():SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    icon: 'any_icon',
    answer: 'any_answer'
  },
  {
    icon: 'any_icon2',
    answer: 'any_answer2'
  }],
  date: new Date()
})

const makeSurveyResultData = (): SurveyResultModel => ({
  id: 'valid_survey_result_id',
  surveyId: 'valid_survey_id',
  accountId: 'valid_account_id',
  answer: 'valid_answer',
  date: new Date()
})

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
    jest.spyOn(loadSurveyById, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
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
    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(success(makeSurveyResultData()))
  })
})
