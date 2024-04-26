import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

type SutTypes = {
    sut: AccountMongoRepository
}
const makeSut = (): SutTypes => {
  const sut = new AccountMongoRepository()
  return {
    sut
  }
}
let collection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })
  test('Should return an account on add success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const account = await sut.add(accountData)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email')
    expect(account.password).toBe('valid_password')
  })

  test('Should return an account on loadByEmail success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@hotmail.com',
      password: 'valid_password'
    }
    await collection.insertOne(accountData)
    const account = await sut.loadByEmail('valid_email@hotmail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email@hotmail.com')
    expect(account.password).toBe('valid_password')
  })

  test('Should return null if loadByEmail fails', async () => {
    const { sut } = makeSut()
    const account = await sut.loadByEmail('valid_email@hotmail.com')
    expect(account).toBeFalsy()
  })
})
