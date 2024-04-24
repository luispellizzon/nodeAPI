import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpsRequest } from '../../protocols'
import { LoginController } from './login'
type SutTypes = {
    sut: LoginController,
    emailValidator: any
}
const makeSut = (): SutTypes => {
  const emailValidator = null
  const sut = new LoginController()
  return {
    sut,
    emailValidator
  }
}

const makeFakeLoginAccount = () => ({
  body: {
    email: 'any_email@hotmail.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpsRequest = makeFakeLoginAccount()
    delete httpRequest.body.email
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpsRequest = makeFakeLoginAccount()
    delete httpRequest.body.password
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
