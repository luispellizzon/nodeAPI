import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpsRequest } from '../../protocols'
import { LoginController } from './login'

describe('Login Controller', () => {
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

    test('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut()
      const httpRequest: HttpsRequest = {
        body: {
          password: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })
})
