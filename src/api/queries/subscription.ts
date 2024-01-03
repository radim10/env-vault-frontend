import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetCheckoutUrlArgs,
  GetCheckoutUrlData,
  GetCheckoutUrlError,
  GetSubscriptionData,
  GetSubscriptionError,
  getCheckoutUrl,
  getSubscription,
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

export const useGetSubscription = (
  workspaceId: string,
  opt?: UseQueryOptions<GetSubscriptionData, GetSubscriptionError>
) =>
  useQuery<GetSubscriptionData, GetSubscriptionError>(
    ['subscription', workspaceId],
    () => {
      return getSubscription(workspaceId)
    },
    opt
  )
