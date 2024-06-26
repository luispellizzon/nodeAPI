import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'
import swaggerConfig from '@/main/docs'
import { noCache } from '../middlewares/no-cache-swagger'
export default (app: Express): void => {
  app.use('/api-docs', noCache, serve, setup(swaggerConfig))
}
