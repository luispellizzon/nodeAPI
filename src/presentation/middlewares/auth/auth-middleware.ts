import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { AccessDeniedError } from '../../errors/access-denied'
import { forbidden, success } from '../../helpers/http/http-helper'
import { HttpResponse, HttpsRequest, Middleware } from '../../protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {
    this.loadAccountByToken = loadAccountByToken
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      const user = await this.loadAccountByToken.load(accessToken)
      if (user) {
        return success({ accountId: user.id })
      }
    }
    return forbidden(new AccessDeniedError())
  }
}
