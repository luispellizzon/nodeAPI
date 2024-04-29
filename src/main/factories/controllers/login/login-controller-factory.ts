import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../../presentation/controllers/login/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeDbAuthentication } from '../../use-cases/authentication/db-authentication-factory'
import { makeLoggerControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const validationComposite = makeLoginValidation()
  const dbAuthentication = makeDbAuthentication()
  const loginController = new LoginController(dbAuthentication, validationComposite)
  return makeLoggerControllerDecorator(loginController)
}
