import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel, HttpsRequest } from './signup-protocols'
import { SignUpController } from './signup'
import { success, serverError, badRequest } from '../../helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (credentials: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

type SutType = {
    sut: SignUpController,
    emailValidatorStub: EmailValidator,
    addAccountStub: AddAccount
}
const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}
const makeFakeAccount = (): AccountModel => (
  {
    id: 'valid_id',
    name: 'valid name',
    email: 'valid email',
    password: 'valid password'
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
  // Test name param
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.name
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  // Test email param
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  // Test password param
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  // Test confirm param
  test('Should return 400 if no confirmation confirmationPassword is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    delete httpRequest.body.confirmationPassword
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('confirmationPassword')))
  })

  // Test email validation param
  test('Should return 400 if email provided is INVALID', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  // Test email validator instance
  test('Should call Email Validator with valid email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    httpRequest.body.email = 'valid@email.com'
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('valid@email.com')
  })

  // Test server error
  test('Should return 500 if EmailValidator fails and throw', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  // Test confirmation password fails if not equal to password
  test('Should return 400 if password is not equal to confirmation password', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    httpRequest.body.confirmationPassword = 'random_password'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('confirmationPassword')))
  })

  // Test AddAccount interface
  test('Must call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const isValidSpy = jest.spyOn(addAccountStub, 'add')
    const request = {
      body: {
        name: 'Luis Pellizzon',
        email: 'luis@gmail.com',
        password: '123123',
        confirmationPassword: '123123'
      }
    }

    sut.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith({
      name: 'Luis Pellizzon',
      email: 'luis@gmail.com',
      password: '123123'
    })
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
})
