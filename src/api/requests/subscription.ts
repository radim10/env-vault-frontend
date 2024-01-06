import { Invoice, SubscriptionData } from '@/types/subscription'
import sendRequest, { APIError } from '../instance'

export type SharedErrorCode =
  | 'current_user_not_found'
  | 'workspace_not_found'
  | 'missing_permission'
  | 'subscription_not_found'
  | 'user_not_owner'

export type SharedError = APIError<SharedErrorCode>

export type SubscriptionErrorCode =
  | SharedErrorCode
  | 'session_not_found'
  | 'subscription_already_canceled'
  | 'subscription_already_dowgraded'
  | 'subscription_not_downgraded'
  | 'cannot_downgrade_subscription'
  | 'cannot_undo_downgrade_subscription'
  | 'cannot_renew_subscription'
  | 'cannot_upgrade_subscription'
  | 'subscription_already_upgraded'
  | 'subscription_canceled'
  // for update tax id
  | 'is_current_tax_id'
  | 'invalid_country'
  | 'invalid_tax_id'
  | 'no_tax_id'

export type SubscriptionError<T extends SubscriptionErrorCode | void> = APIError<T>

export function subscriptionErrorMsgFromCode(code?: SubscriptionErrorCode): string {
  let msg = 'Something went wrong'

  if (code === 'workspace_not_found') {
    msg = 'Workspace not found'
  }

  if (code === 'current_user_not_found') {
    msg = 'Current user not found'
  }

  if (code === 'session_not_found') {
    msg = 'Session not found'
  }

  if (code === 'subscription_not_found') {
    msg = 'Subscription not found'
  }

  if (code === 'user_not_owner') {
    msg = 'User is not workspace owner'
  }

  if (code === 'subscription_already_canceled') {
    msg = 'Subscription already canceled'
  }

  if (code === 'subscription_already_dowgraded') {
    msg = 'Subscription already downgraded'
  }

  if (code === 'subscription_not_downgraded') {
    msg = 'Subscription not downgraded'
  }

  if (code === 'cannot_downgrade_subscription') {
    msg = 'Cannot downgrade subscription'
  }

  if (code === 'cannot_undo_downgrade_subscription') {
    msg = 'Cannot undo downgrade subscription'
  }

  if (code === 'cannot_renew_subscription') {
    msg = 'Cannot renew subscription'
  }

  if (code === 'cannot_upgrade_subscription') {
    msg = 'Cannot upgrade subscription'
  }

  if (code === 'subscription_already_upgraded') {
    msg = 'Subscription already upgraded'
  }

  if (code === 'subscription_canceled') {
    msg = 'Subscription canceled'
  }

  return msg
}

export type GetCheckoutUrlError = SubscriptionError<SharedErrorCode>
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

//
export type GetUpdatePaymentUrlData = { url: string }
export type GetUpdatePaymentUrlError = SubscriptionError<SharedErrorCode | 'subscription_not_found'>
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

export type GetSubscriptionData = SubscriptionData
export type GetSubscriptionError = SubscriptionError<'workspace_not_found'>
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
export type CancelSubscriptionError = SubscriptionError<
  SharedErrorCode | 'subscription_not_found' | 'subscription_already_canceled'
>
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
export type GetPreviewUpgradeSubscriptionError = SubscriptionError<
  SharedErrorCode | 'subscription_already_upgraded' | 'subscription_already_canceled'
>

export async function getPreviewUpgradeSubscription(workspaceId: string) {
  const response = sendRequest<GetPreviewUpgradeSubscriptionData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/subscription/upgrade`,
  })
  return await response
}

export type UpgradeSubscriptionResData = undefined
export type UpgradeSubscriptionError = SubscriptionError<
  SharedErrorCode | 'cannot_upgrade_subscription'
>
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
export type DowngradeSubscriptionError = SubscriptionError<
  | SharedErrorCode
  | 'subscription_already_canceled'
  | 'subscription_already_dowgraded'
  | 'cannot_downgrade_subscription'
>
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
export type UndoDowngradeSubscriptionError = SubscriptionError<
  SharedErrorCode | 'subscription_not_downgraded' | 'cannot_undo_downgrade_subscription'
>
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
export type RenewSubscriptionError = SubscriptionError<
  SharedErrorCode | 'cannot_renew_subscription'
>
export type RenewSubscriptionArgs = { workspaceId: string }

export async function renewSubscription(args: RenewSubscriptionArgs) {
  const response = sendRequest<RenewSubscriptionResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/renew`,
  })
  return await response
}

// update tax id
export type UpdateTaxIdResData = undefined
export type UpdateTaxIdError = SubscriptionError<
  SharedErrorCode | 'invalid_country' | 'invalid_tax_id' | 'is_current_tax_id'
>
export type UpdateTaxIdArgs = {
  workspaceId: string
  data: {
    country: string
    taxId: string
  }
}

export async function updateTaxId(args: UpdateTaxIdArgs) {
  const response = sendRequest<UpdateTaxIdResData>({
    method: 'PATCH',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/tax-id`,
    body: args.data,
  })
  return await response
}

// NOTE: update customer name
export type UpdateCustomerNameResData = undefined
export type UpdateCustomerNameError = SubscriptionError<SharedErrorCode>
export type UpdateCustomerNameArgs = {
  workspaceId: string
  data: {
    name: string
  }
}

export async function updateCustomerName(args: UpdateCustomerNameArgs) {
  const response = sendRequest<UpdateCustomerNameResData>({
    method: 'PATCH',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/customer-name`,
    body: args.data,
  })
  return await response
}

//NOTE: delete tax id
export type DeleteTaxIdResData = undefined
export type DeleteTaxIdError = SubscriptionError<SharedErrorCode | 'no_tax_id'>
export type DeleteTaxIdArgs = {
  workspaceId: string
}

export async function deleteTaxId(args: DeleteTaxIdArgs) {
  const response = sendRequest<DeleteTaxIdResData>({
    method: 'DELETE',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/tax-id`,
  })
  return await response
}

// NOTE: list invoices
export type ListInvoicesResData = {
  cursor?: string
  data: Invoice[]
}

export type ListInvoicesError = SubscriptionError<SharedErrorCode>
export type ListInvoicesArgs = {
  workspaceId: string
  cursor?: string
}

export async function listInvoices(args: ListInvoicesArgs) {
  const response = sendRequest<ListInvoicesResData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${args.workspaceId}/subscription/invoices`,
    params: args?.cursor
      ? {
          cursor: args.cursor,
        }
      : undefined,
  })
  return await response
}
