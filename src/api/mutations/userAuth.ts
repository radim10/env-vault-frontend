import {
  ChangeEmailData,
  ChangeEmailError,
  ChangeEmailResData,
  CreateAccountPasswordData,
  CreateAccountPasswordError,
  CreateAccountPasswordResData,
  DeletePendingEmailError,
  DeletePendingEmailResData,
  GetPendingEmailError,
  GetPendingEmailResData,
  RemoveAuthMethodData,
  RemoveAuthMethodError,
  RemoveAuthMethodResData,
  RevokeUserSessionError,
  RevokeUserSessionResData,
  UpdateAccountPasswordData,
  UpdateAccountPasswordError,
  UpdateAccountPasswordResData,
  changeEmail,
  createAccountPassword,
  deletePendingEmail,
  removeAuthMethod,
  revokeUserSession,
  updateAccountPassword,
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

type UpdateAccountPasswordVariables = UpdateAccountPasswordData

export const useUpdateAccountPassword = (opt?: MutOpt<UpdateAccountPasswordResData>) =>
  useMutation<
    UpdateAccountPasswordResData,
    UpdateAccountPasswordError,
    UpdateAccountPasswordVariables
  >(updateAccountPassword, opt)

export const useRevokeUserSession = (opt?: MutOpt<RevokeUserSessionResData>) =>
  useMutation<RevokeUserSessionResData, RevokeUserSessionError, RevokeUserSessionVariables>(
    ({ sessionId }) => revokeUserSession(sessionId),
    opt
  )

//
type RemoveAccountAuthMethod = RemoveAuthMethodData

export const useRemoveAccountAuthMethod = (opt?: MutOpt<RemoveAuthMethodResData>) =>
  useMutation<RemoveAuthMethodResData, RemoveAuthMethodError, RemoveAccountAuthMethod>(
    removeAuthMethod,
    opt
  )

export const useChangeEmail = (opt?: MutOpt<ChangeEmailResData>) =>
  useMutation<ChangeEmailResData, ChangeEmailError, ChangeEmailData>(changeEmail, opt)

export const useDeletePendingEmail = (opt?: MutOpt<DeletePendingEmailResData>) =>
  useMutation<DeletePendingEmailResData, DeletePendingEmailError, null>(deletePendingEmail, opt)
