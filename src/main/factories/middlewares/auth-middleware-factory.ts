import { AuthMiddleware } from '@/presentation/middlewares/auth/auth-middleware'
import { Middleware } from '@/presentation/protocols'
import { makeDbLoadAccountByToken } from '@/main/factories/use-cases/account/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleware = (role?:string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}
