import { Controller, HttpResponse, HttpsRequest } from '../../presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  constructor (controller: Controller) {
    this.controller = controller
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest)
    return response
  }
}
