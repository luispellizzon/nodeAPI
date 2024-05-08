import { serverError, unauthorizedError, badRequest, notFound, forbiddenError } from './components/'
import { loginPath, surveyPath } from './paths/'
import { accountSchema, apiKeyAuthSchema, errorSchema, loginParamsSchema, surveyAnswerSchema, surveySchema, surveysSchema } from './schemas/'
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
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema
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
