import { Router } from 'express'
import { expressRouteAdapter } from '../adapters/express/express-route-adapter'
import { auth } from '@/main/middlewares/auth'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-factory'

export default (router: Router) => {
  router.put('/surveys/:surveyId/results', auth, expressRouteAdapter(makeSaveSurveyResultController()))
}
