import { MissingParamError, ServerError } from '../../errors'
import { AddAccount, AddAccountModel, AccountModel, HttpsRequest, Validation } from './signup-controller-protocols'
import { SignUpController } from './signup-controller'
import { success, serverError, badRequest } from '../../helpers/http/http-helper'

type SutType = {
    sut: SignUpController,
    addAccountStub: AddAccount,
    validationStub: Validation
}
const makeSut = (): SutType => {
  const validationStub = makeValidationStub()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
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
    email: 'any_email',
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
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  // Test success procedure
  test('Must return 200 and user account information', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(success(makeFakeAccount()))
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
})
