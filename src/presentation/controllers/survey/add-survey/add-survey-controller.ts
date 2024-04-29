import { badRequest } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, HttpsRequest, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {
    this.validation = validation
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)

    try {
      if (error) {
        return badRequest(error)
      }

      return new Promise(resolve => resolve(null))
    } catch (error) {

    }
  }
}
