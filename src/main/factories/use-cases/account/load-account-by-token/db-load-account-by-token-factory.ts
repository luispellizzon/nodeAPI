import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { LoadAccountByToken } from '@/domain/use-cases/account/load-account-by-token'
import { DbLoadAccountByToken } from '@/data/use-cases/account/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import env from '@/main/config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  return new DbLoadAccountByToken(new JwtAdapter(env.jwtSecret), new AccountMongoRepository())
}
