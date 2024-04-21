import { MissingParamError } from '../errors/missing-params-error'
import { HttpsRequest } from '../protocols/http'
import { SignUpController } from './signup'

describe('Sign Up Controller', () => {
  // Test name param
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
    const sut = new SignUpController()
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
})
