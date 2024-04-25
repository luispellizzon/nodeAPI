import { Server } from 'http'
import { ServerError } from '../../presentation/errors'
import { Controller, HttpResponse, HttpsRequest } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { serverError, success } from '../../presentation/helpers/http/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { AccountModel } from '../../domain/models/account'

const makeLogErrorRepositoryStub = ():LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LogErrorRepositoryStub()
}

type SutTypes = {
  sut: LogControllerDecorator,
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository
}
const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(success(makeFakeAccount())))
    }
  }
  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

const makeFakeRequest = (): HttpsRequest => (
  {
    body: {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
      confirmationPassword: 'valid_password'
    }
  }
)

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid name',
    email: 'valid email',
    password: 'valid password'
  }
)

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}
describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const httpRequest = makeFakeRequest()
    const controllerHandleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(httpRequest)
    expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should decorator return the same response from controller', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(success(makeFakeAccount()))
  })

  test('Should LogControllerDecorator capture internal server error 500', async () => {
    const { sut, controllerStub } = makeSut()
    const errorMock = serverError(new Error())
    const httpRequest = makeFakeRequest()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(errorMock)))
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(500)
  })

  test('Should call LogErrorRepository with error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeServerError())))
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
