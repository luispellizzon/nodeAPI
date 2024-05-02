import { ObjectId } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel, AddAccountModel } from '../../../../data/use-cases/add-account/db-add-account-protocols'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'

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
