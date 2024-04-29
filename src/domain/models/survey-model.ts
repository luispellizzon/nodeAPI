import { SurveyAnswer } from './survey-answer'

export type SurveyModel = {
    id: string
    question: string,
    answers: SurveyAnswer[],
}
