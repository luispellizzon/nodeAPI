import { SurveyResultModel } from '@/data/use-cases/survey-result/save-survey-result/db-save-survey-result-protocols'
import { SurveyModel } from '../models/survey-model'
import { SaveSurveyResultParams } from '../use-cases/survey-result/save-survey-result'
import { AddSurveyParams } from '../use-cases/survey/add-survey'

export const mockAddSurvey = ():AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    icon: 'any_icon',
    answer: 'any_answer'
  }],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_question',
    answers: [
      {
        icon: 'any_image',
        answer: 'any_answer'
      }
    ],
    date: new Date()
  }
)

export const mockSaveSurveyResultParams = ():SaveSurveyResultParams => ({
  surveyId: 'survey_id',
  accountId: 'account_id',
  answer: 'any_answer',
  date: new Date()
})

export const mockSaveSurveyResult = (): SurveyResultModel => (Object.assign({}, mockSaveSurveyResultParams(), { id: 'any_id' }))
