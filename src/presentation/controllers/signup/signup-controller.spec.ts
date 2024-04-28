import { MissingParamError, ServerError, AlreadyExistsError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, HttpsRequest, Validation, Authentication, AuthenticationModel } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { success, serverError, badRequest, forbidden } from '../../helpers/http/http-helper'

type SutType = {
  sut: SignUpController,
  addAccountStub: AddAccount,
  validationStub: Validation,
  authenticationStub: Authentication
}
const makeSut = (): SutType => {
  const validationStub = makeValidationStub()
  const addAccountStub = makeAddAccount()
  const authenticationStub = makeAuthenticationStub()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async auth (authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeValidationStub = (): any => {
  class ValidationStub implements Validation {
    validate (body: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (credentials: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'any_name',
    email: 'any_email@hotmail.com',
    password: 'any_password'
  }
)

const makeFakeRequest = ():HttpsRequest => (
  {
    body: {
      name: 'any_name',
      email: 'any_email@hotmail.com',
      password: 'any_password',
      confirmationPassword: 'any_password'
    }
  }
)
describe('Sign Up Controller', () => {
  // Test AddAccount interface
  test('Must call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const isValidSpy = jest.spyOn(addAccountStub, 'add')
    const request = makeFakeRequest()
    await sut.handle(request)
    delete request.body.confirmationPassword
    expect(isValidSpy).toHaveBeenCalledWith(request.body
    )
  })

  // Test AddAccount on throw error
  test('Must return 500 if AddAccount throws while add method', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  // Test success procedure
  test('Must return 200 and user accessToken', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(success({ accessToken: 'any_token' }))
  })

  // Test Validation interface
  test('Must call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error bad request', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const isAuthSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const fakeAccount = makeFakeAccount()
    expect(isAuthSpy).toHaveBeenCalledWith({ email: fakeAccount.email, password: fakeAccount.password })
  })

  test('Should return 500 if authentication throws ', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Must return 403 if add account returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(forbidden(new AlreadyExistsError('email')))
  })
})
