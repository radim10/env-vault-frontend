import { MutOpt } from '../mutOpt'
import { useMutation } from '@tanstack/react-query'
import {
  RevokeCliTokenArgs,
  RevokeCliTokenError,
  RevokeCliTokenResData,
  revokeCliToken,
} from '@/api/requests/tokens/cli'

// revoke (delete)
type RevokeCliTokenVariables = RevokeCliTokenArgs

export const useRevokeCliToken = (opt?: MutOpt<RevokeCliTokenResData>) =>
  useMutation<undefined, RevokeCliTokenError, RevokeCliTokenVariables>(revokeCliToken, opt)
