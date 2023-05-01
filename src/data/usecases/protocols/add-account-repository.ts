/* eslint-disable @typescript-eslint/consistent-type-imports */
import { AccountModel } from '../../../domain/models/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'

/* eslint-disable @typescript-eslint/method-signature-style */
export interface AddAccountRepository {
  add (account: AddAccountModel): Promise<AccountModel | null>
}