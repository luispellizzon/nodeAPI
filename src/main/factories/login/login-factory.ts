import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { DbAuthentication } from '../../../data/use-cases/authentication/db-authentication'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, validationComposite)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logErrorRepository)
}
