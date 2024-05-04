import { MongoClient, Collection, WithId, Document } from 'mongodb'

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

  static map<T> (obj: WithId<Document>): T {
    if (obj) {
      if (obj._id !== undefined) {
        const mappedObj = { id: obj._id.toString(), ...obj }
        delete mappedObj._id
        return mappedObj as T
      }
    }
  }
}
