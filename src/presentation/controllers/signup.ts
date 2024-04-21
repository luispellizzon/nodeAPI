import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { HttpResponse, HttpsRequest } from '../protocols/http'
import { Controller } from '../protocols/controller'
import { RequiredFields } from '../types/required-fields'
import { EmailValidator } from '../protocols/email-validator'

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
      console.error(error)
      return serverError()
    }
  }
}
