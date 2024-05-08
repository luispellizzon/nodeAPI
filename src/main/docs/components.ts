import { badRequest, unauthorizedError, serverError, notFound, forbiddenError } from './components/'
import { apiKeyAuthSchema } from './schemas/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },

  badRequest,
  unauthorizedError,
  serverError,
  notFound,
  forbiddenError
}
