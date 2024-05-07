import { AuthenticationParams } from '../use-cases/account/authentication'

export const mockAuthentication = ():AuthenticationParams => ({
  email: 'any_email@gmail.com',
  password: 'any_password'
})
