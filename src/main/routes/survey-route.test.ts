import request from 'supertest'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

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

let surveysCollection: Collection
let accountCollection: Collection
describe('Survey Route', () => {
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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any_question',
          answers: [{
            icon: 'any_image',
            answer: 'any_answer'
          },
          {
            answer: 'any_answer2'
          }]
        })
        .expect(403)
    })

    test('Should return 403 on add survey if user is not admin', async () => {
      const accessToken = await makeAccessToken('any')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [{
            icon: 'any_image',
            answer: 'any_answer'
          },
          {
            answer: 'any_answer2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const accessToken = await makeAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [{
            icon: 'any_image',
            answer: 'any_answer'
          },
          {
            answer: 'any_answer2'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on load surveys success with valid accessToken', async () => {
      const accessToken = await makeAccessToken()
      await surveysCollection.insertOne({
        question: 'any_question',
        answers: [{
          icon: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'any_answer2'
        }],
        date: new Date()
      })
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
