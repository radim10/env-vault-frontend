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

export type CancelSubscriptionResData = undefined
export type CancelSubscriptionError = any
export type CancelSubscriptionArgs = { workspaceId: string }

export async function cancelSubscription(args: CancelSubscriptionArgs) {
  const response = sendRequest<CancelSubscriptionResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/cancel`,
  })
  return await response
}

export type GetPreviewUpgradeSubscriptionData = {
  invoice: { amount: number }
}
export type GetPreviewUpgradeSubscriptionError = any

export async function getPreviewUpgradeSubscription(workspaceId: string) {
  const response = sendRequest<GetPreviewUpgradeSubscriptionData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/subscription/upgrade`,
  })
  return await response
}

export type UpgradeSubscriptionResData = undefined
export type UpgradeSubscriptionError = any
export type UpgradeSubscriptionArgs = { workspaceId: string }

export async function upgradeSubscription(args: UpgradeSubscriptionArgs) {
  const response = sendRequest<UpgradeSubscriptionResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/upgrade`,
  })
  return await response
}
