import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { Controller } from '../../../presentation/protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../presentation/controllers/login/login-controller'

export const makeLoginController = (): Controller => {
  const validationComposite = makeLoginValidation()
  const signUpController = new LoginController(null, validationComposite)
  const logErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
