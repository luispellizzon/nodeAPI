import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (value: string): Promise<string> {
    jwt.verify(value, this.secret)
    return new Promise(resolve => resolve(null))
  }
}
