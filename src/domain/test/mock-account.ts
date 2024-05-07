import { AccountModel, AddAccountParams } from '@/data/use-cases/account/add-account/db-add-account-protocols'

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@hotmail.com',
  password: 'hashed_password'
})

export const mockAddAccountParams = ():AddAccountParams => (
  {
    name: 'any_name',
    email: 'any_email@hotmail.com',
    password: 'any_password'
  }
)
