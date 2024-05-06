import { Controller, HttpResponse, HttpsRequest, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    await this.loadSurveyById.loadById(surveyId)
    return null
  }
}
