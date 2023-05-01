/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/consistent-type-imports */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../protocols/add-account-repository'
import { Encrypter } from '../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepossitory: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepossitory: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepossitory = addAccountRepossitory
  }
    
  async add (accountData: AddAccountModel): Promise<AccountModel | null> {
    const hashedPAssword = await this.encrypter.encrypt(accountData.password)
    
    // esse primeiro parametro vazio nao modifica o objeto accountData
    return await this.addAccountRepossitory.add(Object.assign({}, accountData, { password: hashedPAssword }))
  }
}