import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import { SurveyModel } from '@/domain/models/survey-model'
let surveysCollection: Collection
let accountCollection: Collection
const makeAccessToken = async (role?:string): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'valid_name',
    email: 'valid_email@gmail.com',
    password: 'valid_password',
    role
  })
  const accessToken = sign({ id: res.insertedId.toString() }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: res.insertedId
  }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const surveyData = {
    question: 'any_question',
    answers: [{
      icon: 'any_icon',
      answer: 'any_answer'
    },
    {
      icon: 'any_icon2',
      answer: 'any_answer2'
    }],
    date: new Date()
  }
  const survey = await surveysCollection.insertOne(surveyData)

  return { id: survey.insertedId.toString(), ...surveyData }
}

describe('Save Survey Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveysCollection.deleteMany({})
    await accountCollection.deleteMany({})
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

    test('Should return 200 on save survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('admin')
      const survey = await makeSurvey()

      await request(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer2'
        })
        .expect(200)
    })
  })
})
