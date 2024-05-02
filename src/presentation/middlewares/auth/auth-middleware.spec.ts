import { HttpResponse, HttpsRequest, Middleware } from '../../protocols'
import { AuthMiddleware } from './auth-middleware'
import { forbidden } from '../../helpers/http/http-helper'
import { AccessDeniedError } from '../../errors/access-denied'
import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { AccountModel } from '../../../domain/models/account'

type SutTypes = {
    sut: AuthMiddleware,
    loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)

  return {
    sut,
    loadAccountByTokenStub
  }
}

const makeFakeAccount = () => (
  {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@hotmail.com',
    password: 'any_password'
  }
)

const makeLoadAccountByTokenStub = () => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: string | undefined): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenStub()
}

describe('Auth Middleware', () => {
  test('Should return 403 access denied if no token is provided on headers', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
