import { SurveyModel } from '@/domain/models/survey-model'

export interface LoadSurveyById{
    loadById(surveyId: string): Promise<SurveyModel>
}
