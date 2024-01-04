import { useMutation } from '@tanstack/react-query'
import { MutOpt } from './mutOpt'
import {
  CancelSubscriptionError,
  CancelSubscriptionResData,
  CancelSubscriptionArgs,
  UpgradeSubscriptionResData,
  cancelSubscription,
  UpgradeSubscriptionError,
  upgradeSubscription,
  DowngradeSubscriptionResDate,
  DowngradeSubscriptionError,
  downgradeSubscription,
  RenewSubscriptionResData,
  RenewSubscriptionError,
  renewSubscription,
  UndoDowngradeSubscriptionResDate,
  UndoDowngradeSubscriptionError,
  undoDowngradeSubscription,
} from '../requests/subscription'

type UseCancelSubscriptionVariables = CancelSubscriptionArgs

export const useCancelSubscription = (opt?: MutOpt<CancelSubscriptionResData>) =>
  useMutation<CancelSubscriptionResData, CancelSubscriptionError, UseCancelSubscriptionVariables>(
    cancelSubscription,
    opt
  )

type UseUpgradeSubscriptionVariables = UseCancelSubscriptionVariables

export const useUpgradeSubscription = (opt?: MutOpt<UpgradeSubscriptionResData>) =>
  useMutation<
    UpgradeSubscriptionResData,
    UpgradeSubscriptionError,
    UseUpgradeSubscriptionVariables
  >(upgradeSubscription, opt)

// NOTE: downgrade
type UseDowngradeSubscriptionVariables = UseCancelSubscriptionVariables

export const useDowngradeSubscription = (opt?: MutOpt<DowngradeSubscriptionResDate>) =>
  useMutation<
    DowngradeSubscriptionResDate,
    DowngradeSubscriptionError,
    UseDowngradeSubscriptionVariables
  >(downgradeSubscription, opt)

// NOTE: undo downgrade
type UseUndoDowngradeSubscriptionVariables = UseCancelSubscriptionVariables

export const useUndoDowngradeSubscription = (opt?: MutOpt<UndoDowngradeSubscriptionResDate>) =>
  useMutation<
    UndoDowngradeSubscriptionResDate,
    UndoDowngradeSubscriptionError,
    UseUndoDowngradeSubscriptionVariables
  >(undoDowngradeSubscription, opt)

// NOTE: renew
type UseRenewSubscriptionVariables = UseCancelSubscriptionVariables

export const useRenewSubscription = (opt?: MutOpt<RenewSubscriptionResData>) =>
  useMutation<RenewSubscriptionResData, RenewSubscriptionError, UseRenewSubscriptionVariables>(
    renewSubscription,
    opt
  )
