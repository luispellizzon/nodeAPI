import { SurveyModel } from '@/domain/models/survey-model'

export interface LoadSurveyByIdRepository{
    loadById(surveyId: string): Promise<SurveyModel>
}
