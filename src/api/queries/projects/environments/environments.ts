import {
  GetEnvironmentArgs,
  GetEnvironmentData,
  GetEnvironmentError,
  GetEnvironmentsData,
  GetEnvironmentsError,
  getEnvironment,
  getEnvironments,
} from '@/api/requests/projects/environments/environments'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

export const useGetEnvironment = (
  args: GetEnvironmentArgs,
  opt?: UseQueryOptions<GetEnvironmentData, GetEnvironmentError>
) =>
  useQuery<GetEnvironmentData, GetEnvironmentError>(
    [args.workspaceId, args.projectName, args.envName],
    () => {
      return getEnvironment(args)
    },
    opt
  )

export const useGetEnvironments = (
  args: {
    workspaceId: string
    projectName: string
  },
  opt?: UseQueryOptions<GetEnvironmentsData, GetEnvironmentsError>
) =>
  useQuery<GetEnvironmentsData, GetEnvironmentsError>(
    [args.workspaceId, args.projectName, 'environments'],
    () => {
      return getEnvironments(args)
    },
    opt
  )
