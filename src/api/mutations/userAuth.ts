import {
  CreateAccountPasswordData,
  CreateAccountPasswordError,
  CreateAccountPasswordResData,
  createAccountPassword,
} from '../requests/userAccount'
import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'

// create
type CreateAccountPasswordVariables = CreateAccountPasswordData

export const useCreateAccountPassword = (opt?: MutOpt<CreateAccountPasswordResData>) =>
  useMutation<
    CreateAccountPasswordResData,
    CreateAccountPasswordError,
    CreateAccountPasswordVariables
  >(createAccountPassword, opt)
