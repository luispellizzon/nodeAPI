import { Controller, HttpResponse, HttpsRequest, LoadSurveyById, forbidden, AccessDeniedError, InvalidParamError, serverError } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const isSurvey = await this.loadSurveyById.loadById(surveyId)
      if (!isSurvey) {
        return forbidden(new InvalidParamError('survey_id'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
