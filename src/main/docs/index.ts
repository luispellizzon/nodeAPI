import { serverError, unauthorizedError, badRequest, notFound, forbiddenError } from './components/'
import { loginPath, surveyPath, signUpPath } from './paths/'
import { accountSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema, signUpParamsSchema } from './schemas/'
import { addSurveyParamsSchema } from './schemas/add-survey-params-schema'
export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Clean Node API (Typescript)',
    version: '1.0.0'
  },
  license: {
    name: '',
    url: ''
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    {
      name: 'Login'
    },
    {
      name: 'Surveys'
    }],
  paths: {
    '/login': loginPath,
    '/signup': signUpPath,
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    addSurveyParams: addSurveyParamsSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },

    badRequest,
    unauthorizedError,
    serverError,
    notFound,
    forbiddenError
  }
}
