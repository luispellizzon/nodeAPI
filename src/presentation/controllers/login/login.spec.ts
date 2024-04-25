import { LoginController } from './login'
import { serverError, success, unauthorized } from '../../helpers/http-helper'
import { Authentication, HttpsRequest, Validation } from './login-protocols'
import { ValidationComposite } from '../../helpers/validators/validation-composite'
type SutTypes = {
    sut: LoginController,
  authenticationStub: Authentication,
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validationStub = new ValidationComposite([makeValidationStub()])
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const makeValidationStub = (): any => {
  class ValidationStub implements Validation {
    validate (body: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeFakeRequest = () => ({
  body: makeFakeAccount()
})

const makeFakeAccount = () => ({
  email: 'any_email@hotmail.com',
  password: 'any_password'
})

describe('Login Controller', () => {
  test('Should call Validation with correct email', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if emailValidator throws ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const isAuthSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const fakeAccount = makeFakeAccount()
    expect(isAuthSpy).toHaveBeenCalledWith(fakeAccount.email, fakeAccount.password)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpRequest: HttpsRequest = makeFakeRequest()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if authentication throws ', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpsRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      accessToken: 'any_token'
    }))
  })
})
