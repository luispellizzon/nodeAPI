import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let collection: Collection
let accountCollection: Collection
describe('Survey Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    collection = await MongoHelper.getCollection('surveys')
    accountCollection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
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
      const res = await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        role: 'other_role'
      })
      const accessToken = sign({ id: res.insertedId.toString() }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: res.insertedId
      }, {
        $set: {
          accessToken
        }
      })
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
      const res = await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        role: 'admin'
      })
      const accessToken = sign({ id: res.insertedId.toString() }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: res.insertedId
      }, {
        $set: {
          accessToken
        }
      })
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
  })
})
