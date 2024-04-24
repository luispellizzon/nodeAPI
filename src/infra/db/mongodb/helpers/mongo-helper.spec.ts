import { MongoHelper as sut } from './mongo-helper'

describe('', () => {
  beforeAll(async () => await sut.connect(process.env.MONGO_URL))

  afterAll(async () => await sut.disconnect())

  test('Should reconnect if mongodb is down', async () => {
    await sut.disconnect()
    const collection = await sut.getCollection('accounts')
    expect(collection).toBeTruthy()
  })
})
