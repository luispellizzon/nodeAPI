import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Signup Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    const collection = MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        confirmationPassword: 'valid_password'
      })
      .expect(200)
  })
})
