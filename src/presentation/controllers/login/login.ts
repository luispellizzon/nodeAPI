import { Authentication, EmailValidator, Controller, HttpResponse, HttpsRequest } from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { RequiredFields } from '../../types/required-fields'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

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
      const { email, password } = httpRequest.body
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError(RequiredFields.Email))
      }

      const token = await this.authentication.auth(email, password)
      if (!token) {
        return unauthorized()
      }
      return new Promise(resolve => resolve(null))
    } catch (error) {
      return serverError(error)
    }
  }
}
