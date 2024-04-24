import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await errorCollection.deleteMany({})
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
  })

  test('Should create a error log on success ', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_stack_trace')
    const countDocs = await errorCollection.countDocuments()
    expect(countDocs).toBe(1)
  })
})
