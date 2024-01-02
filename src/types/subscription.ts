export enum SubscriptionPlan {
  Free = 'FREE',
  Startup = 'STARTUP',
  Business = 'BUSINESS',
}

interface Subscription {
  usersCount: number
  billingCycleAnchor: Date
  currentPlan: SubscriptionPlan
  //
  cancelAt?: Date
  canceledPlan?: SubscriptionPlan
}

// export interface SubscriptionDetails {
//   usersCount: number
//   billingCycleAnchor: Date
//   cancelAt?: Date
//   downgradeAt?: Date
//   canceledAt?: Date
//   canceledPlan?: WorkspaceSubscription
//   cardExpired?: boolean
//   //
//   card?: Card
//   taxId?: string
//   customerName?: string
//   //
//   handoverSentAt?: Date
// }
