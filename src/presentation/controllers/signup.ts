import { MissingParamError } from '../errors/missing-params-error'
import { badRequest } from '../helpers/http-helper'
import { HttpResponse, HttpsRequest } from '../protocols/http'
import { Controller } from '../protocols/controller'
import { RequiredFields } from '../types/required-fields'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'
import { ServerError } from '../errors/server-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpsRequest): HttpResponse {
    const requiredFieldsForSignUp: RequiredFields[] = [
      RequiredFields.Name,
      RequiredFields.Email,
      RequiredFields.Password,
      RequiredFields.ConfirmationPassword
    ]
    try {
      for (const field of requiredFieldsForSignUp) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError(RequiredFields.Email))
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
