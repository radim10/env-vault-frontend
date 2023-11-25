import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { GetGoogleLinkError, GetGoogleLinkResData, getGoogleLink } from '../requests/auth'

export const useGetGoogleLink = (opt?: UseQueryOptions<GetGoogleLinkResData, GetGoogleLinkError>) =>
  useQuery<GetGoogleLinkResData, GetGoogleLinkError>(['google-link'], getGoogleLink, opt)
