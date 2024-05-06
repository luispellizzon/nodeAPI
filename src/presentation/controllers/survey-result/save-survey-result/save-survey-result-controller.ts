import { Controller, HttpResponse, HttpsRequest, LoadSurveyById, forbidden, AccessDeniedError, InvalidParamError } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    const isSurvey = await this.loadSurveyById.loadById(surveyId)
    if (!isSurvey) {
      return forbidden(new InvalidParamError('survey_id'))
    }
  }
}
