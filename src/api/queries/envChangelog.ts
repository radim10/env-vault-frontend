import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetEnvChangelogItemSecretsData,
  GetEnvChangelogItemSecretsError,
  GetEnvChangelogItemSecretsReqArgs,
  getEnvChangelogItemSecrets,
} from '../requests/envChangelog'

export const useGetEnvChangelogItemSecrets = (
  args: GetEnvChangelogItemSecretsReqArgs,
  opt?: UseQueryOptions<GetEnvChangelogItemSecretsData, GetEnvChangelogItemSecretsError>
) =>
  useQuery<GetEnvChangelogItemSecretsData, GetEnvChangelogItemSecretsError>(
    ['changelog-secrets', args?.changeId],
    () => {
      return getEnvChangelogItemSecrets(args)
    },
    opt
  )
