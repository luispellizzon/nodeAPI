import { Decrypter, AccountModel, LoadAccountByTokenRepository, LoadAccountByToken } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (private readonly decrypter: Decrypter,
      private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {
    this.decrypter = decrypter
    this.loadAccountByTokenRepository = loadAccountByTokenRepository
  }

  async load (token: string, role?: string): Promise<AccountModel> {
    const accessToken = await this.decrypter.decrypt(token)
    if (accessToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(token, role)
      if (account) {
        return account
      }
    }
    return null
  }
}
