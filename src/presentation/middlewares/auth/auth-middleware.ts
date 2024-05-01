import { AccessDeniedError } from '../../errors/access-denied'
import { forbidden } from '../../helpers/http/http-helper'
import { HttpResponse, HttpsRequest, Middleware } from '../../protocols'

export class AuthMiddleware implements Middleware {
  handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
    return new Promise((resolve) => resolve(forbidden(new AccessDeniedError())))
  }
}
