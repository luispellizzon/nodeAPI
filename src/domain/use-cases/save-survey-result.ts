import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult{
    save(date:SaveSurveyResultModel): Promise<SurveyResultModel>
}
