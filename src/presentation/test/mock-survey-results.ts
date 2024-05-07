import { SurveyModel } from '@/domain/models/survey-model'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSaveSurveyResult, mockSurveyModel } from '@/domain/test'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result'
import { LoadSurveyById } from '@/domain/use-cases/survey/load-survey-by-id'

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (surveyId: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(mockSurveyModel()))
    }
  }
  return new LoadSurveyByIdStub()
}

export const mockSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(mockSaveSurveyResult()))
    }
  }
  return new SaveSurveyResultStub()
}
