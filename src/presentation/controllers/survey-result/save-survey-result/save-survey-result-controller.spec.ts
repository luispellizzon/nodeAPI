import { SurveyModel } from '@/domain/models/survey-model'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpsRequest, LoadSurveyById, forbidden, AccessDeniedError } from './save-survey-result-controller-protocols'

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

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyById } = makeSut()
    jest.spyOn(loadSurveyById, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.handle(makeRequest())
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
