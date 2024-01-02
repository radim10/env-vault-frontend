import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetCheckoutUrlArgs,
  GetCheckoutUrlData,
  GetCheckoutUrlError,
  getCheckoutUrl,
} from '../requests/subscription'

export const useGetCheckoutUrl = (
  args: GetCheckoutUrlArgs,
  opt?: UseQueryOptions<GetCheckoutUrlData, GetCheckoutUrlError>
) =>
  useQuery<GetCheckoutUrlData, GetCheckoutUrlError>(
    ['subscription', 'checkout'],
    () => {
      return getCheckoutUrl(args)
    },
    { cacheTime: 0, ...opt }
  )
