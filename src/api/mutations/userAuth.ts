import {
  CreateAccountPasswordData,
  CreateAccountPasswordError,
  CreateAccountPasswordResData,
  RevokeUserSessionError,
  RevokeUserSessionResData,
  createAccountPassword,
  revokeUserSession,
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

type RevokeUserSessionVariables = {
  sessionId: string
}

export const useRevokeUserSession = (opt?: MutOpt<RevokeUserSessionResData>) =>
  useMutation<RevokeUserSessionResData, RevokeUserSessionError, RevokeUserSessionVariables>(
    ({ sessionId }) => revokeUserSession(sessionId),
    opt
  )
