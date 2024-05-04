import { Controller } from '@/presentation/protocols'
import { makeLoggerControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { makeDbLoadSurveys } from '@/main/factories/use-cases/survey/load-surveys/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveys = makeDbLoadSurveys()
  const loadSurveyController = new LoadSurveysController(loadSurveys)
  return makeLoggerControllerDecorator(loadSurveyController)
}
