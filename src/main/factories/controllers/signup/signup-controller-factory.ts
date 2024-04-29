import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../use-cases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '../../use-cases/add-account/db-add-account-factory'
import { makeLoggerControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const dbAddAccount = makeDbAddAccount()
  const validationComposite = makeSignUpValidation()
  const dbAuthentication = makeDbAuthentication()
  const signUpController = new SignUpController(dbAddAccount, validationComposite, dbAuthentication)
  return makeLoggerControllerDecorator(signUpController)
}
