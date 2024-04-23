import { MongoClient, Collection } from 'mongodb'

export class MongoHelper {
  static client: MongoClient | null = null

  static async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  }

  static async disconnect (): Promise<void> {
    if (this.client) {
      await this.client.close()
    }
  }

  static getCollection (name: string): Collection {
    return this.client.db().collection(name)
  }
}
