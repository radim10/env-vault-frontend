import {
  GetEnvironmentData,
  GetEnvironmentError,
  getEnvironment,
} from '@/api/requests/projects/environments/environments'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

export const useGetEnvironment = (
  args: {
    workspaceId: string
    projectName: string
    envName: string
  },
  opt?: UseQueryOptions<GetEnvironmentData, GetEnvironmentError>
) =>
  useQuery<GetEnvironmentData, GetEnvironmentError>(
    [args.workspaceId, args.projectName, args.envName],
    () => {
      return getEnvironment(args)
    },
    opt
  )
