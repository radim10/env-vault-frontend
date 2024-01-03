import { SubscriptionData } from '@/types/subscription'
import sendRequest from '../instance'

export type GetCheckoutUrlError = any
export type GetCheckoutUrlData = { url: string }
export type GetCheckoutUrlArgs = {
  workspaceId: string
  plan: 'startup' | 'business'
}

export async function getCheckoutUrl(args: GetCheckoutUrlArgs) {
  const { workspaceId, plan } = args

  const response = sendRequest<GetCheckoutUrlData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/subscription/checkout/${plan}`,
  })
  return await response
}

export type GetSubscriptionData = SubscriptionData
export type GetSubscriptionError = any

export async function getSubscription(workspaceId: string) {
  const response = sendRequest<GetSubscriptionData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/subscription`,
  })
  return await response
}
