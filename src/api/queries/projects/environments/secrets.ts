import {
  GetSecretsData,
  GetSecretsError,
  getSecrets,
} from '@/api/requests/projects/environments/secrets'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

export const useGetSecrets = (
  args: {
    workspaceId: string
    projectName: string
    envName: string
  },
  opt?: UseQueryOptions<GetSecretsData, GetSecretsError>
) =>
  useQuery<GetSecretsData, GetSecretsError>(
    [args.workspaceId, args.projectName, args.envName, 'secrets'],
    () => {
      return getSecrets(args)
    },
    opt
  )
