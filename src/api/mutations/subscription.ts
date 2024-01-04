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
