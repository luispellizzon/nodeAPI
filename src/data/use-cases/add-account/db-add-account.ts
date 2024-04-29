import { AddAccount, AddAccountModel, AccountModel, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const isAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (!isAccount) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
      return account
    }
    return null
  }
}
