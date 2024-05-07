import { SurveyModel } from '@/domain/models/survey-model'
export type AddSurveyParams = Omit<SurveyModel, 'id'>

export interface AddSurvey{
    add(surveyData:AddSurveyParams): Promise<void>
}
