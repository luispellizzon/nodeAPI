import { loginPath } from './paths/login-path'
import { accountSchema } from './schemas/account-schema'
import { loginParamsSchema } from './schemas/login-params-schema'
import { unauthorizedErrorSchema } from './schemas/unauthorized-error-schema'
export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Clean Node API (Typescript)',
    version: '1.0.0'
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
    unauthorizedError: unauthorizedErrorSchema
  }
}
