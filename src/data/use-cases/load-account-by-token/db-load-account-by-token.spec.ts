import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

type SutTypes = {
    sut: DbLoadAccountByToken,
    decrypterStub:Decrypter
}
const makeSut = ():SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
  }
}

const makeDecrypterStub = () => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('any_id'))
    }
  }
  return new DecrypterStub()
}

const fakeToken = () => 'any_token'

describe('DbLoadAccountByToken Use-case', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load(fakeToken())
    expect(decrypterSpy).toHaveBeenCalledWith(fakeToken())
  })
})
