import { Server } from 'http'
import { ServerError } from '../../presentation/errors'
import { Controller, HttpResponse, HttpsRequest } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { serverError } from '../../presentation/helpers/http-helper'

type SutTypes = {
  sut: LogControllerDecorator,
  controllerStub: Controller,
  logErrorRepositoryStub: any
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
  const sut = new LogControllerDecorator(controllerStub)
  const logErrorRepositoryStub = null
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
})
