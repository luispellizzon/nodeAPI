import { AddSurveyParams } from '@/domain/use-cases/survey/add-survey'
import { AddSurveyRepository, LoadSurveyByIdRepository, LoadSurveysRepository } from '../protocols/db/survey'
import { SurveyModel } from '@/domain/models/survey-model'
import { mockSaveSurveyResult, mockSurveyModel } from '@/domain/test'
import { SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/use-cases/survey-result/save-survey-result'

export const mockAddSurveyRepository = () => {
  class AddAccountRepositoryStub implements AddSurveyRepository {
    add (accountData: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadSurveyByIdRepository = () => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (surveyId: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(mockSurveyModel()))
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = () => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    loadAll (): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve([mockSurveyModel()]))
    }
  }
  return new LoadSurveysRepositoryStub()
}

export const mockSaveSurveyRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(mockSaveSurveyResult()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
