import { Decrypter } from '../../../data/protocols/cryptography/decrypter'
import { Encrypter } from '../../../data/protocols/cryptography/encrypter'
import jwt, { JwtPayload } from 'jsonwebtoken'
export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {
    this.secret = secret
  }

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (token: string): Promise<string> {
    const decoded:any = await jwt.verify(token, this.secret)
    return decoded
  }
}
