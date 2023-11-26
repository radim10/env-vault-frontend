import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetGithubUrlError,
  GetGithubUrlResData,
  GetGoogleLinkError,
  GetGoogleLinkResData,
  getGithubUrl,
  getGoogleLink,
} from '../requests/auth'

export const useGetGoogleLink = (
  ivnitationId: string | null,
  opt?: UseQueryOptions<GetGoogleLinkResData, GetGoogleLinkError>
) =>
  useQuery<GetGoogleLinkResData, GetGoogleLinkError>(
    ['google-link'],
    () => getGoogleLink(ivnitationId),
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
