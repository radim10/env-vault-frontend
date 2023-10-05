import { MutOpt } from '../mutOpt'
import { useMutation } from '@tanstack/react-query'
import {
  CreateCliTokenArgs,
  CreateCliTokenError,
  CreateCliTokenResData,
  RevokeCliTokenArgs,
  RevokeCliTokenError,
  RevokeCliTokenResData,
  createCliToken,
  revokeCliToken,
} from '@/api/requests/tokens/cli'

// create
type CreateCliTokenVariables = CreateCliTokenArgs

export const useCreateCliToken = (opt?: MutOpt<CreateCliTokenResData>) =>
  useMutation<CreateCliTokenResData, CreateCliTokenError, CreateCliTokenVariables>(
    createCliToken,
    opt
  )

// revoke (delete)
type RevokeCliTokenVariables = RevokeCliTokenArgs

export const useRevokeCliToken = (opt?: MutOpt<RevokeCliTokenResData>) =>
  useMutation<undefined, RevokeCliTokenError, RevokeCliTokenVariables>(revokeCliToken, opt)
