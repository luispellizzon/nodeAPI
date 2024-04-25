import { InvalidParamError } from '../../errors'
import { badRequest, success, serverError } from '../../helpers/http-helper'
import { HttpResponse, HttpsRequest, Controller, AddAccount, Validation } from './signup-protocols'
import { RequiredFields } from '../../types/required-fields'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation:Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body)
    if (error) {
      return badRequest(error)
    }

    try {
      const { name, email, password, confirmationPassword } = httpRequest.body

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
      return serverError(error)
    }
  }
}
