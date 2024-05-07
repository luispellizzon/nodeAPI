import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'
import { mockAddAccountParams } from '@/domain/test'

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

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const { sut } = makeSut()
      const accountData = mockAddAccountParams()
      const account = await sut.add(accountData)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@hotmail.com')
      expect(account.password).toBe('any_password')
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const { sut } = makeSut()
      const accountData = {
        name: 'any_name',
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
      await collection.insertOne(accountData)
      const account = await sut.loadByEmail('any_email@hotmail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@hotmail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByEmail fails', async () => {
      const { sut } = makeSut()
      const account = await sut.loadByEmail('any_email@hotmail.com')
      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const { sut } = makeSut()
      const accountData = {
        name: 'any_name',
        email: 'any_email@hotmail.com',
        password: 'any_password'
      }
      const { insertedId } = await collection.insertOne(accountData)
      const newAccount = await collection.findOne({ email: accountData.email })
      expect(newAccount?.accessToken).toBeFalsy()
      await sut.updateAccessToken(insertedId.toString(), 'any_token')
      const accountAfterUpdate = await collection.findOne({ email: accountData.email })
      expect(accountAfterUpdate).toBeTruthy()
      expect(accountAfterUpdate?.accessToken).toBeTruthy()
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken with no role', async () => {
      const { sut } = makeSut()
      const accountData = {
        name: 'any_name',
        email: 'any_email@hotmail.com',
        password: 'any_password',
        accessToken: 'any_token'
      }
      await collection.insertOne(accountData)
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@hotmail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return an account on loadByToken with admin role', async () => {
      const { sut } = makeSut()
      const accountData = {
        name: 'any_name',
        email: 'any_email@hotmail.com',
        password: 'any_password',
        role: 'admin',
        accessToken: 'any_token'
      }
      await collection.insertOne(accountData)
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@hotmail.com')
      expect(account.password).toBe('any_password')
    })

    test('Should return null if loadByToken fails', async () => {
      const { sut } = makeSut()
      const account = await sut.loadByEmail('any_token')
      expect(account).toBeFalsy()
    })

    test('Should return null on loadByToken with inany role', async () => {
      const { sut } = makeSut()
      const accountData = {
        name: 'any_name',
        email: 'any_email@hotmail.com',
        password: 'any_password',
        accessToken: 'any_token'
      }
      await collection.insertOne(accountData)
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const { sut } = makeSut()
      const accountData = {
        name: 'any_name',
        email: 'any_email@hotmail.com',
        password: 'any_password',
        role: 'admin',
        accessToken: 'any_token'
      }
      await collection.insertOne(accountData)
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@hotmail.com')
      expect(account.password).toBe('any_password')
    })
  })
})
