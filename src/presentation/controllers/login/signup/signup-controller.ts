import { Authentication } from '@/domain/use-cases/authentication'
import { AlreadyExistsError } from '@/presentation/errors'
import { badRequest, success, serverError, forbidden } from '@/presentation/helpers/http/http-helper'
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
      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new AlreadyExistsError('email'))
      }

      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return success({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
