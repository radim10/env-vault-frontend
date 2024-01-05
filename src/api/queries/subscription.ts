import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  GetCheckoutUrlArgs,
  GetCheckoutUrlData,
  GetCheckoutUrlError,
  GetPreviewUpgradeSubscriptionData,
  GetPreviewUpgradeSubscriptionError,
  GetSubscriptionData,
  GetSubscriptionError,
  GetUpdatePaymentUrlArgs,
  GetUpdatePaymentUrlData,
  GetUpdatePaymentUrlError,
  getCheckoutUrl,
  getPreviewUpgradeSubscription,
  getSubscription,
  getUpdatePaymentUrl,
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

//
export const useGetUpdatePaymentUrl = (
  args: GetUpdatePaymentUrlArgs,
  opt?: UseQueryOptions<GetUpdatePaymentUrlData, GetUpdatePaymentUrlError>
) =>
  useQuery<GetUpdatePaymentUrlData, GetUpdatePaymentUrlError>(
    ['subscription', 'payment-url'],
    () => {
      return getUpdatePaymentUrl(args)
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

export const useGetPreviewSubscriptionUpgrade = (
  workspaceId: string,
  opt?: UseQueryOptions<GetPreviewUpgradeSubscriptionData, GetPreviewUpgradeSubscriptionError>
) =>
  useQuery<GetPreviewUpgradeSubscriptionData, GetPreviewUpgradeSubscriptionError>(
    ['subscription', workspaceId, 'upgrade'],
    () => {
      return getPreviewUpgradeSubscription(workspaceId)
    },
    opt
  )
