import { MongoClient, Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'

export class MongoHelper {
  static client: MongoClient = null
  static uri: string = null

  static async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  }

  static async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close()
    }
    this.client = null
  }

  static async getCollection (name: string): Promise<Collection> {
    if (!this.client?.db()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  }

  static map (account: any): any {
    return account && {
      id: account._id,
      ...account
    }
  }
}
