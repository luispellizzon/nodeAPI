import { HttpsRequest, LoadAccountByToken, AccountModel } from './auth-middleware-protocols'
import { AuthMiddleware } from './auth-middleware'
import { forbidden, serverError, success } from '../../helpers/http/http-helper'
import { AccessDeniedError } from '../../errors'

type SutTypes = {
    sut: AuthMiddleware,
    loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (role?:string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

const makeFakeAccount = ():AccountModel => (
  {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@hotmail.com',
    password: 'any_password'
  }
)

const makeFakeHeaderWithToken = (): HttpsRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

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

  test('Should call LoadAccountByToken with correct accessToken and role', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = makeFakeHeaderWithToken()
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 if LoadAccountByToken does not find a user', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = makeFakeHeaderWithToken()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken finds user', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHeaderWithToken()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(success({ accountId: 'any_id' }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest = makeFakeHeaderWithToken()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(new Error()))
  })
})
