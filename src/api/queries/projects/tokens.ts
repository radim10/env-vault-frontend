import { getEnvTokens, GetEnvTokensData, GetEnvTokensError } from '@/api/requests/tokens'
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
