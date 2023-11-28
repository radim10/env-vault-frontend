import {
  CreateAccountPasswordData,
  CreateAccountPasswordError,
  CreateAccountPasswordResData,
  ListUserSessionsData,
  ListUserSessionsError,
  createAccountPassword,
  listUserSessions,
} from '../requests/userAuth'
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
