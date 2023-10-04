import { useMutation } from '@tanstack/react-query'
import { MutOpt } from '../mutOpt'
import {
  CreateEnvironmentTokenArgs,
  CreateEnvironmentTokenError,
  CreateEnvironmentTokenResData,
  RevokeEnvironmentTokenArgs,
  RevokeEnvironmentTokenError,
  RevokeEnvironmentTokenResData,
  createEnvironmentToken,
  revokeEnvironmentToken,
} from '../../requests/projects/environments/tokens'

// create
type CreateEnvironmentTokenVariables = CreateEnvironmentTokenArgs

export const useCreateEnvironmentToken = (opt?: MutOpt<CreateEnvironmentTokenResData>) =>
  useMutation<
    CreateEnvironmentTokenResData,
    CreateEnvironmentTokenError,
    CreateEnvironmentTokenVariables
  >(createEnvironmentToken, opt)

// revoke (delete)
type RevokeEnvironmentTokenVariables = RevokeEnvironmentTokenArgs

export const useRevokeEnvironmentToken = (opt?: MutOpt<RevokeEnvironmentTokenResData>) =>
  useMutation<undefined, RevokeEnvironmentTokenError, RevokeEnvironmentTokenVariables>(
    revokeEnvironmentToken,
    opt
  )
