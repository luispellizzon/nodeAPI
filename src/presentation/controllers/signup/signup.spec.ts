import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './signup-protocols'
import { SignUpController } from './signup'

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
      const mockAccount = {
        id: 'valid_id',
        name: 'valid name',
        email: 'valid email',
        password: 'valid password'
      }
      return new Promise(resolve => resolve(mockAccount))
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

describe('Sign Up Controller', () => {
  // Test name param
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: 'password',
        confirmationPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  // Test email param
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        password: 'password',
        confirmationPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  // Test password param
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        confirmationPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  // Test confirm param
  test('Should return 400 if no confirmation confirmationPassword is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirmationPassword'))
  })
  // Test email validation param
  test('Should return 400 if email provided is INVALID', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'name',
        email: 'invalid@email.com',
        password: 'password',
        confirmationPassword: 'confirmationPassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  // Test email validator instance
  test('Should call Email Validator with valid email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'name',
        email: 'valid@email.com',
        password: 'password',
        confirmationPassword: 'confirmationPassword'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('valid@email.com')
  })
  // Test server error
  test('Should return 500 if EmailValidator fails and throw', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'name',
        email: 'invalid@email.com',
        password: 'password',
        confirmationPassword: 'confirmationPassword'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(null))
  })
  // Test confirmation password fails if not equal to password
  test('Should return 400 if password is not equal to confirmation password', async () => {
    const { sut } = makeSut()
    const httpsRequest = {
      body: {
        name: 'Any',
        email: 'any@an2',
        password: 123,
        confirmationPassword: 321
      }
    }
    const response = await sut.handle(httpsRequest)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('confirmationPassword'))
  })
  // Test AddAccount interface
  test('Must call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const isValidSpy = jest.spyOn(addAccountStub, 'add')
    const request = {
      body: {
        name: 'Luis Pellizzon',
        email: 'luis@gmail.com',
        password: 123123,
        confirmationPassword: 123123
      }
    }

    sut.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith({
      name: 'Luis Pellizzon',
      email: 'luis@gmail.com',
      password: 123123
    })
  })
  // Test AddAccount on throw error
  test('Must return 500 if AddAccount throws while add method', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const request = {
      body: {
        name: 'Luis Pellizzon',
        email: 'luis@gmail.com',
        password: 123123,
        confirmationPassword: 123123
      }
    }

    const response = await sut.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(null))
  })
  // Test success procedure
  test('Must return 200 and user account information', async () => {
    const { sut } = makeSut()

    const request = {
      body: {
        name: 'valid_name',
        email: 'valid_email',
        password: 'valid_password',
        confirmationPassword: 'valid_password'
      }
    }

    const response = await sut.handle(request)
    const { name, email, password } = response.body
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: 'valid_id',
      name,
      email,
      password
    })
  })
})
