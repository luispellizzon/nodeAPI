import { HttpResponse, HttpsRequest, Middleware } from '../../protocols'
import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../../helpers/http/http-helper'
import { AccessDeniedError } from '../../errors/access-denied'

type SutTypes = {
    sut: AuthMiddleware
}
const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware()

  return {
    sut
  }
}

const makeAuthenticationStub = (): Middleware => {
  class AuthMiddlewareStub implements Middleware {
    handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(null))
    }
  }

  return new AuthMiddlewareStub()
}

describe('Auth Middleware', () => {
  test('Should return 403 access denied if no token is provided on headers', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
