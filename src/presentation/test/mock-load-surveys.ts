import { SurveyModel } from '@/domain/models/survey-model'
import { mockSurveyModel } from '@/domain/test'
import { LoadSurveys } from '@/domain/use-cases/survey/load-surveys'

export const mockLoadSurveys = () => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve([mockSurveyModel()]))
    }
  }
  return new LoadSurveysStub()
}
