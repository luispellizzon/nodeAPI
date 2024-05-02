import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'

type SutTypes = {
    sut: DbLoadAccountByToken,
    decrypterStub: Decrypter,
    loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}
const makeSut = ():SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub = makeDbLoadAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new DecrypterStub()
}

const makeDbLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class DbLoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    loadByToken (token: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new DbLoadAccountByTokenRepositoryStub()
}

const makeFakeAccount = () => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  password: 'hashed_password'
})
const fakeToken = () => 'any_token'

describe('DbLoadAccountByToken Use-case', () => {
  test('Should call Decrypter with correct values', async () => {
    const role = 'any_role'
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load(fakeToken(), role)
    expect(decrypterSpy).toHaveBeenCalledWith(fakeToken())
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load(fakeToken())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load(fakeToken(), role)
    expect(loadByTokenSpy).toHaveBeenCalledWith(fakeToken(), role)
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load(fakeToken())
    expect(account).toBeNull()
  })
})
