/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Encrypter } from '../../data/usecases/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  private readonly salt: number
  
  constructor (salt: number) {
    this.salt = salt
  }
  
  // async nao fica na interface apenas na implementacao do modulo
  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}