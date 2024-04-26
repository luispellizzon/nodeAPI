import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

type SutTypes = {
    sut: BcryptAdapter,
    salt: number
  }
const makeSut = (): SutTypes => {
  const salt = 12
  const sut = new BcryptAdapter(salt)
  return {
    sut,
    salt
  }
}

jest.mock('bcrypt', () => ({
  hash (): Promise<string> {
    return new Promise(resolve => resolve('hash_password'))
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('Should return hashed value if bcrypt is success', async () => {
    const { sut } = makeSut()
    const result = await sut.hash('any_value')
    expect(result).toBe('hash_password')
  })

  test('Should throw if bcrypt throws', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.hash('any_value')
    expect(promise).rejects.toThrow()
  })
})
