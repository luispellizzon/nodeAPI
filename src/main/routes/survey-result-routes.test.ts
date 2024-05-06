import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

describe('Save Survey Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer2'
        })
        .expect(403)
    })
  })
})
