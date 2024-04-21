import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, success, serverError } from '../../helpers/http-helper'
import { HttpResponse, HttpsRequest, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { RequiredFields } from '../../types/required-fields'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
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
      const { name, email, password, confirmationPassword } = httpRequest.body

      const isEmailValid = this.emailValidator.isValid(email)

      if (!isEmailValid) {
        return badRequest(new InvalidParamError(RequiredFields.Email))
      }

      if (password !== confirmationPassword) {
        return badRequest(new InvalidParamError(RequiredFields.ConfirmationPassword))
      }

      const accountData = await this.addAccount.add({
        name,
        email,
        password
      })
      return success(accountData)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
