import { Controller, HttpResponse, HttpsRequest, LoadSurveys } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {
    this.loadSurveys = loadSurveys
  }

  async handle (httpsRequest: HttpsRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()
    return null
  }
}
