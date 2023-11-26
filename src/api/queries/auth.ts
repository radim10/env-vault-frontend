import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { GetGoogleLinkError, GetGoogleLinkResData, getGoogleLink } from '../requests/auth'

export const useGetGoogleLink = (
  ivnitationId: string | null,
  opt?: UseQueryOptions<GetGoogleLinkResData, GetGoogleLinkError>
) =>
  useQuery<GetGoogleLinkResData, GetGoogleLinkError>(
    ['google-link'],
    () => getGoogleLink(ivnitationId),
    opt
  )
