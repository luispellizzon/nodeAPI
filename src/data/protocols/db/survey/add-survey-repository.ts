import { AddSurveyModel } from '../../../../domain/use-cases/add-survey'

export interface AddSurveyRepository{
    add(accountData: AddSurveyModel): Promise<void>
}
