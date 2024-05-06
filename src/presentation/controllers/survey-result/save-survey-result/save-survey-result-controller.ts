import { Controller, HttpResponse, HttpsRequest, LoadSurveyById, forbidden, AccessDeniedError, InvalidParamError, serverError } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {
    this.loadSurveyById = loadSurveyById
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body
      const isSurvey = await this.loadSurveyById.loadById(surveyId)
      if (isSurvey) {
        const answers = isSurvey.answers.map(a => a.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('survey_id'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
