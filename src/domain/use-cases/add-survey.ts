import { SurveyModel } from '../models/survey-model'
export type AddSurveyModel = Omit<SurveyModel, 'id'>

export interface AddSurvey{
    add(surveyData:AddSurveyModel): Promise<void>
}
