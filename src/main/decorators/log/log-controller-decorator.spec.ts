import {
  Controller,
  HttpResponse,
  HttpsRequest,
  serverError,
  success,
  AccountModel,
  LogErrorRepository
} from './log-controller-decorator-protocols'
import { LogControllerDecorator } from './log-controller-decorator'
import { mockLogErrorRepository } from '@/data/test'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  sut: LogControllerDecorator,
  controllerStub: Controller,
  logErrorRepositoryStub: LogErrorRepository
}
const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(success(mockAccountModel())))
    }
  }
  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = mockLogErrorRepository()
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
    expect(response).toEqual(success(mockAccountModel()))
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
