import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { LoadSurveys } from '@/domain/use-cases/survey/load-surveys'
import { DbLoadSurveys } from '@/data/use-cases/survey/load-surveys/db-load-surveys'

export const makeDbLoadSurveys = (): LoadSurveys => {
  const loadSurveysRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(loadSurveysRepository)
}
