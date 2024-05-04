import {
  Controller,
  HttpResponse,
  HttpsRequest,
  LogErrorRepository,
  ServerError
} from './log-controller-decorator-protocols'

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepository = logErrorRepository
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const response = await this.controller.handle(httpRequest)
    if (response.statusCode === 500) {
      const error = response.body as ServerError
      this.logErrorRepository.logError(error.stack)
    }
    return response
  }
}
