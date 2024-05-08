import { serverError, unauthorizedError, badRequest, notFound } from './components/'
import { loginPath } from './paths/'
import { accountSchema, errorSchema, loginParamsSchema } from './schemas/'
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
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    unauthorizedError,
    serverError,
    notFound
  }
}
