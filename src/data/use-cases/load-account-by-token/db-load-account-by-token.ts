import { LoadAccountByToken } from '../../../domain/use-cases/load-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter:Decrypter) {
    this.decrypter = decrypter
  }

  async load (token: string, role?: string): Promise<AccountModel> {
    const userId = await this.decrypter.decrypt(token)
    return null
  }
}
