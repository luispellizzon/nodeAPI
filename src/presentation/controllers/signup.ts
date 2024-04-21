import { MissingParamError } from '../errors/missing-params-error'
import { badRequest } from '../helpers/http-helper'
import { HttpResponse, HttpsRequest } from '../protocols/http'
import { Controller } from '../protocols/controller'
import { RequiredFields } from '../types/required-fields'

export class SignUpController implements Controller {
  handle (httpRequest: HttpsRequest): HttpResponse {
    const requiredFields: RequiredFields = ['name', 'email', 'password', 'confirmationPassword']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
