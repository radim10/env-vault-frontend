import { useMutation } from '@tanstack/react-query'
import { MutOpt } from './mutOpt'
import {
  CreateWorkspaceTokenArgs,
  CreateWorkspaceTokenError,
  CreateWorkspaceTokenResData,
  createWorkspaceToken,
} from '../requests/tokens'

// create
type CreateWorkspaceTokenVariables = CreateWorkspaceTokenArgs

export const useCreateWorkspaceToken = (opt?: MutOpt<CreateWorkspaceTokenResData>) =>
  useMutation<
    CreateWorkspaceTokenResData,
    CreateWorkspaceTokenError,
    CreateWorkspaceTokenVariables
  >(createWorkspaceToken, opt)

// revoke (delete)
// type RevokeEnvironmentTokenVariables = RevokeEnvironmentTokenArgs
//
// export const useRevokeEnvironmentToken = (opt?: MutOpt<RevokeEnvironmentTokenResData>) =>
//   useMutation<undefined, RevokeEnvironmentTokenError, RevokeEnvironmentTokenVariables>(
//     revokeEnvironmentToken,
//     opt
//   )
