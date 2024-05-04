import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveys } from '../../../../../domain/use-cases/load-surveys'
import { DbLoadSurveys } from '../../../../../data/use-cases/load-surveys/db-load-surveys'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const loadSurveysRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(loadSurveysRepository)
}
