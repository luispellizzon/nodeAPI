import { MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'
import { Controller, HttpResponse, HttpsRequest } from '../../protocols'
import { RequiredFields } from '../../types/required-fields'

export class LoginController implements Controller {
  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const requiredFieldsForLogin: RequiredFields[] = [
      RequiredFields.Email,
      RequiredFields.Password
    ]
    try {
      for (const field of requiredFieldsForLogin) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      return new Promise(resolve => resolve(null))
    } catch (error) {
      return serverError(error)
    }
  }
}
