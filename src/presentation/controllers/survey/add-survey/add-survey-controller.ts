import { AddSurvey } from '../../../../domain/use-cases/add-survey'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, HttpsRequest, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey) {
    this.validation = validation
    this.addSurvey = addSurvey
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    try {
      if (error) {
        return badRequest(error)
      }
      const { answers, question } = httpRequest.body
      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
