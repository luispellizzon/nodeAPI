import { Server } from 'http'
import { ServerError } from '../../presentation/errors'
import { Controller, HttpResponse, HttpsRequest } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { serverError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

const makeLogErrorRepositoryStub = ():LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
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
      const httpResponseMock = {
        statusCode: 200,
        body: {
          ok: 'ok'
        }
      }
      return new Promise(resolve => resolve(httpResponseMock))
    }
  }

  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmationPassword: 'valid_password'
      }
    }
    const controllerHandleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(httpRequest)
    expect(controllerHandleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should decorator return the same response from controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmationPassword: 'valid_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual({
      statusCode: 200,
      body: {
        ok: 'ok'
      }
    })
  })

  test('Should LogControllerDecorator capture internal server error 500', async () => {
    const { sut, controllerStub } = makeSut()
    const errorMock = serverError(new Error())
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmationPassword: 'valid_password'
      }
    }
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(errorMock)))
    const response = await sut.handle(httpRequest)
    expect(response.statusCode).toBe(500)
  })

  test('Should call LogErrorRepository with error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const errorMock = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve) => resolve(errorMock)))
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmationPassword: 'valid_password'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
