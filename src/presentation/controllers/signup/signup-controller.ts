import { Authentication } from '../../../domain/use-cases/authentication'
import { badRequest, success, serverError } from '../../helpers/http/http-helper'
import { HttpResponse, HttpsRequest, Controller, AddAccount, Validation } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication) {
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

      await this.authentication.auth(accountData)

      return success(accountData)
    } catch (error) {
      return serverError(error)
    }
  }
}
