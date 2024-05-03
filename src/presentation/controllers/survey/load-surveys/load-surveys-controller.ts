import { serverError, success } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse, HttpsRequest, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {
    this.loadSurveys = loadSurveys
  }

  async handle (httpsRequest: HttpsRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load()
      if (surveys) {
        return success(surveys)
      }
    } catch (e) {
      return serverError(e)
    }
  }
}
