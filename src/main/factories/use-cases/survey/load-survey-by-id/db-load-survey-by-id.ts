import { DbLoadSurveyById } from '@/data/use-cases/survey/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from '@/domain/use-cases/survey/load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}
