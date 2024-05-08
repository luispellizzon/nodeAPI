import { accountSchema, errorSchema, loginParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema, signUpParamsSchema, surveyResultSchema, saveSurveyResultParamsScheme, addSurveyParamsSchema } from './schemas/'
export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema,
  addSurveyParams: addSurveyParamsSchema,
  surveyResult: surveyResultSchema,
  saveSurveyResultParams: saveSurveyResultParamsScheme
}
