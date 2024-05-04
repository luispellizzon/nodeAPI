import { ObjectId } from 'mongodb'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
  AccountModel,
  AddAccountModel
} from './account-mongo-repository-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const { ...accountDetails } = accountData
    const collection = await MongoHelper.getCollection('accounts')
    const result = await collection.insertOne(accountData)
    const account = { id: result.insertedId.toString(), ...accountDetails }
    return account
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    const account = await collection.findOne({ email })
    return MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    const account = await collection.findOne({
      accessToken: token,
      $or: [
        { role },
        { role: 'admin' }
      ]
    })
    return MongoHelper.map(account)
  }
}
