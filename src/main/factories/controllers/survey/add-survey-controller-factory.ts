import { Controller } from '../../../../presentation/protocols'
import { makeLoggerControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeDbAddSurvey } from '../../use-cases/add-survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  const validation = makeAddSurveyValidation()
  const surveyMongoRepo = makeDbAddSurvey()
  const addSurveyController = new AddSurveyController(validation, surveyMongoRepo)
  return makeLoggerControllerDecorator(addSurveyController)
}
