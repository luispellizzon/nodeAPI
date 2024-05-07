import { AddSurveyParams } from '@/domain/use-cases/survey/add-survey'

export interface AddSurveyRepository{
    add(accountData: AddSurveyParams): Promise<void>
}
