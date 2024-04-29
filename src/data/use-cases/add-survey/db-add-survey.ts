import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
        private readonly addSurveyRepository: AddSurveyRepository) {
    this.addSurveyRepository = addSurveyRepository
  }

  async add (surveyData: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(surveyData)
  }
}
