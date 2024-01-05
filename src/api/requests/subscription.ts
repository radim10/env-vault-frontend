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

//
export type GetUpdatePaymentUrlData = { url: string }
export type GetUpdatePaymentUrlError = any
export type GetUpdatePaymentUrlArgs = {
  workspaceId: string
}

export async function getUpdatePaymentUrl(args: GetUpdatePaymentUrlArgs) {
  const { workspaceId } = args

  const response = sendRequest<GetUpdatePaymentUrlData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/subscription/payment/url`,
  })
  return await response
}

//
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

// NOTE: downgrade
export type DowngradeSubscriptionResDate = undefined
export type DowngradeSubscriptionError = any
export type DowngradeSubscriptionArgs = { workspaceId: string }

export async function downgradeSubscription(args: DowngradeSubscriptionArgs) {
  const response = sendRequest<DowngradeSubscriptionResDate>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/downgrade`,
  })
  return await response
}

// NOTE: Undo downgrade
export type UndoDowngradeSubscriptionResDate = undefined
export type UndoDowngradeSubscriptionError = any
export type UndoDowngradeSubscriptionArgs = DowngradeSubscriptionArgs

export async function undoDowngradeSubscription(args: UndoDowngradeSubscriptionArgs) {
  const response = sendRequest<DowngradeSubscriptionResDate>({
    method: 'DELETE',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/downgrade`,
  })
  return await response
}

// NOTE: renew before cancel date
export type RenewSubscriptionResData = undefined
export type RenewSubscriptionError = any
export type RenewSubscriptionArgs = { workspaceId: string }

export async function renewSubscription(args: RenewSubscriptionArgs) {
  const response = sendRequest<DowngradeSubscriptionResDate>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/renew`,
  })
  return await response
}

// update tax id
export type UpdateTaxIdResData = undefined
export type UpdateTaxIdError = any
export type UpdateTaxIdArgs = {
  workspaceId: string
  data: {
    country: string
    taxId: string
  }
}

export async function updateTaxId(args: UpdateTaxIdArgs) {
  const response = sendRequest<DowngradeSubscriptionResDate>({
    method: 'PATCH',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/tax-id`,
    body: args.data,
  })
  return await response
}
