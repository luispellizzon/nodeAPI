import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-params-error'
import { ServerError } from '../errors/server-error'
import { EmailValidator } from '../protocols/email-validator'
import { HttpsRequest } from '../protocols/http'
import { SignUpController } from './signup'

type SutType = {
    sut: SignUpController,
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutType => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Sign Up Controller', () => {
  // Test name param
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: 'password',
        confirmationPassword: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  // Test email param
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest: HttpsRequest = {
      body: {
        name: 'name',
        password: 'password',
        confirmationPassword: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  // Test password param
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest: HttpsRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        confirmationPassword: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  // Test confirm param
  test('Should return 400 if no confirmation confirmationPassword is provided', () => {
    const { sut } = makeSut()
    const httpRequest: HttpsRequest = {
      body: {
        name: 'name',
        email: 'email@email.com',
        password: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirmationPassword'))
  })
  // Test email validation param
  test('Should return 400 if email provided is INVALID', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest: HttpsRequest = {
      body: {
        name: 'name',
        email: 'invalid@email.com',
        password: 'password',
        confirmationPassword: 'confirmationPassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  // Test email validator instance
  test('Should call Email Validator with valid email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest: HttpsRequest = {
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
  test('Should return 500 if EmailValidator fails and throw', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)
    const httpRequest: HttpsRequest = {
      body: {
        name: 'name',
        email: 'invalid@email.com',
        password: 'password',
        confirmationPassword: 'confirmationPassword'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
