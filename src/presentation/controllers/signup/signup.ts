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
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = httpRequest.body
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
