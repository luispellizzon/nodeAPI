import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '@/main/factories/use-cases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/use-cases/account/add-account/db-add-account-factory'
import { makeLoggerControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const dbAddAccount = makeDbAddAccount()
  const validationComposite = makeSignUpValidation()
  const dbAuthentication = makeDbAuthentication()
  const signUpController = new SignUpController(dbAddAccount, validationComposite, dbAuthentication)
  return makeLoggerControllerDecorator(signUpController)
}
