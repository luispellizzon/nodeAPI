import { SurveyModel } from '@/domain/models/survey-model'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpsRequest, LoadSurveyById } from './save-survey-result-controller-protocols'
import { forbidden } from '@/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '@/presentation/errors'

type SutTypes = {
    sut: SaveSurveyResultController,
    loadSurveyById: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyById = makeLoadSurveyByIdStub()
  const sut = new SaveSurveyResultController(loadSurveyById)
  return {
    sut,
    loadSurveyById
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

const makeRequest = ():HttpsRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

describe('SaveSurveyResultController', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyById } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyById, 'loadById')
    await sut.handle(makeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
