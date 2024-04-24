import { Controller, HttpResponse, HttpsRequest } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

type SutTypes = {
  sut: LogControllerDecorator,
  controllerStub: Controller
}
const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpsRequest): Promise<HttpResponse> {
      const httpResponse = {
        statusCode: 200,
        body: {
          ok: 'ok'
        }
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }
  const controllerStub = new ControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return { sut, controllerStub }
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
})
