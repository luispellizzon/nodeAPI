import { SaveSurveyResult } from '@/domain/use-cases/survey-result/save-survey-result'
import { Controller, HttpResponse, HttpsRequest, LoadSurveyById, forbidden, InvalidParamError, serverError, success } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
        private readonly loadSurveyById: LoadSurveyById,
        private readonly saveSurveyResult: SaveSurveyResult) {
    this.loadSurveyById = loadSurveyById
    this.saveSurveyResult = saveSurveyResult
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    try {
      const { params: { surveyId }, body: { answer }, accountId } = httpRequest
      const isSurvey = await this.loadSurveyById.loadById(surveyId)

      if (!isSurvey) return forbidden(new InvalidParamError('survey_id'))

      const answers = isSurvey.answers.map(a => a.answer)

      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      return success(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
