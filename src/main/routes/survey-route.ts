import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { expressMiddlewareAdapter } from '../adapters/express/express-middleware-adapter'

export default (router: Router): void => {
  const adminAuth = expressMiddlewareAdapter(makeAuthMiddleware('admin'))
  const auth = expressMiddlewareAdapter(makeAuthMiddleware())
  router.post('/surveys', adminAuth, expressRouteAdapter(makeAddSurveyController()))
  router.get('/surveys', auth, expressRouteAdapter(makeLoadSurveysController()))
}
