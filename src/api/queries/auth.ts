import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetGithubUrlError,
  GetGithubUrlResData,
  GetGoogleUrlError,
  GetGoogleUrlResData,
  getGithubUrl,
  getGoogleUrl,
} from '../requests/auth'

export const useGetGoogleUrl = (
  ivnitationId: string | null,
  opt?: UseQueryOptions<GetGoogleUrlResData, GetGoogleUrlError>
) =>
  useQuery<GetGoogleUrlResData, GetGoogleUrlError>(
    ['google-link'],
    () => getGoogleUrl(ivnitationId),
    { ...opt, cacheTime: 0 }
  )

export const useGetGithubUrl = (
  ivnitationId: string | null,
  opt?: UseQueryOptions<GetGithubUrlResData, GetGithubUrlError>
) =>
  useQuery<GetGithubUrlResData, GetGithubUrlError>(
    ['github-url'],
    () => getGithubUrl(ivnitationId),
    { ...opt, cacheTime: 0 }
  )
