/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { AccountModel } from '../../../domain/models/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../protocols/add-account-repository'
import { Encrypter } from '../protocols/encrypter'
import { DbAddAccount } from './db-add-account'


const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepossitoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel | null> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      }
      // eslint-disable-next-line @typescript-eslint/return-await
      return new Promise(resolve => { resolve(fakeAccount) })
    }
  }
  return new AddAccountRepossitoryStub
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      // eslint-disable-next-line @typescript-eslint/return-await
      return new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository

}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}
describe('DbAddAccount UseCases', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
  
  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSspy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }
    await sut.add(accountData)
    expect(addSspy).toHaveBeenCalledWith(accountData)
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }
    const account = await sut.add(accountData)
    // quando se compara dois objetos
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})