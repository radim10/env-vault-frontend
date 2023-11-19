import {
  getEnvTokens,
  GetEnvTokensData,
  GetEnvTokensError,
  getWorkspaceToken,
  GetWorkspaceTokenData,
  GetWorkspaceTokenError,
  getWorkspaceTokens,
  GetWorkspaceTokensData,
  GetWorkspaceTokensError,
} from '@/api/requests/tokens'
import {
  getCliToken,
  GetCliTokenData,
  GetCliTokenError,
  getCliTokens,
  GetCliTokensData,
  GetCliTokensError,
} from '@/api/requests/tokens/cli'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

export const useGetEnvTokens = (
  args: {
    workspaceId: string
  },
  opt?: UseQueryOptions<GetEnvTokensData, GetEnvTokensError>
) =>
  useQuery<GetEnvTokensData, GetEnvTokensError>(
    [args.workspaceId, 'env-tokens'],
    () => {
      return getEnvTokens(args)
    },
    opt
  )

//
export const useGetWorkspaceTokens = (
  args: {
    workspaceId: string
  },
  opt?: UseQueryOptions<GetWorkspaceTokensData, GetWorkspaceTokensError>
) =>
  useQuery<GetWorkspaceTokensData, GetWorkspaceTokensError>(
    [args.workspaceId, 'workspace-tokens'],
    () => {
      return getWorkspaceTokens(args)
    },
    opt
  )

export const useGetWorkspaceToken = (
  args: {
    workspaceId: string
    tokenId: string
  },
  opt?: UseQueryOptions<GetWorkspaceTokenData, GetWorkspaceTokenError>
) =>
  useQuery<GetWorkspaceTokenData, GetWorkspaceTokenError>(
    [args.workspaceId, 'workspace-tokens', args.tokenId],
    () => {
      return getWorkspaceToken(args)
    },
    opt
  )

export const useGetCliTokens = (
  args: {
    workspaceId: string
  },
  opt?: UseQueryOptions<GetCliTokensData, GetCliTokensError>
) =>
  useQuery<GetCliTokensData, GetCliTokensError>(
    [args.workspaceId, 'cli-tokens'],
    () => {
      return getCliTokens(args.workspaceId)
    },
    opt
  )

export const useGetCliToken = (
  args: {
    workspaceId: string
    tokenId: string
  },
  opt?: UseQueryOptions<GetCliTokenData, GetCliTokenError>
) =>
  useQuery<GetCliTokenData, GetCliTokenError>(
    [args.workspaceId, 'cli-tokens', args.tokenId],
    () => {
      return getCliToken(args)
    },
    opt
  )
