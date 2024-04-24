import { MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpResponse, HttpsRequest } from '../../protocols'
import { RequiredFields } from '../../types/required-fields'

export class LoginController implements Controller {
  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
  }
}
