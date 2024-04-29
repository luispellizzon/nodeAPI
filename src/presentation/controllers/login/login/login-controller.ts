import { Authentication, Controller, HttpResponse, HttpsRequest, Validation } from './login-controller-protocols'
import { badRequest, serverError, success, unauthorized } from '../../../helpers/http/http-helper'

export class LoginController implements Controller {
  constructor (private readonly authentication: Authentication, private readonly validation:Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({
        email,
        password
      })
      if (!accessToken) {
        return unauthorized()
      }
      return success({
        accessToken
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
