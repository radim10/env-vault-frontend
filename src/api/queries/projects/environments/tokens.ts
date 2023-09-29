import {
  GetEnvironmentTokensData,
  GetEnvironmentTokensError,
  getEnvironmentTokens,
} from '@/api/requests/projects/environments/tokens'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

export const useGetEnvironmentTokens = (
  args: {
    workspaceId: string
    projectName: string
    envName: string
  },
  opt?: UseQueryOptions<GetEnvironmentTokensData, GetEnvironmentTokensError>
) =>
  useQuery<GetEnvironmentTokensData, GetEnvironmentTokensError>(
    [args.workspaceId, args.projectName, args.envName, 'tokens'],
    () => {
      return getEnvironmentTokens(args)
    },
    opt
  )
