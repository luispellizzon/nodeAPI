import { LogControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { makeLoginValidation } from './login-validation'
import { LoginController } from '../../../presentation/controllers/login/login'

export const makeLoginController = (): Controller => {
  const validationComposite = makeLoginValidation()
  const signUpController = new LoginController(null, validationComposite)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
