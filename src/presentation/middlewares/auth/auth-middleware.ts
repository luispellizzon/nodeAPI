import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { AccessDeniedError } from '../../errors/access-denied'
import { forbidden } from '../../helpers/http/http-helper'
import { HttpResponse, HttpsRequest, Middleware } from '../../protocols'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {
    this.loadAccountByToken = loadAccountByToken
  }

  async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken)
    }
    return forbidden(new AccessDeniedError())
  }
}
