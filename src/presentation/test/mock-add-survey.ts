import { AddSurvey, AddSurveyParams } from '@/domain/use-cases/survey/add-survey'

export const mockAddSurvey = ():AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyStub()
}
