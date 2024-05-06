import { makeLoggerControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbSaveSurveyResult } from '@/main/factories/use-cases/survey-result/save-survey-result/db-save-survey-result-factory'
import { makeDbLoadSurveyById } from '@/main/factories/use-cases/survey/load-survey-by-id/db-load-survey-by-id'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return makeLoggerControllerDecorator(controller)
}
