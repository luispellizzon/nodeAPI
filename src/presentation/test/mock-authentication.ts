import { Authentication, AuthenticationParams } from '@/domain/use-cases/account/authentication'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async auth (authentication: AuthenticationParams): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}
