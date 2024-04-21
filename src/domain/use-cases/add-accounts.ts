import { AccountModel } from '../models/account'

export type AddAccountModel = Omit<AccountModel, 'id'>

export interface AddAccount{
    add(credentials: AddAccountModel): Promise<AccountModel>
}
