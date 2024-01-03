export enum SubscriptionPlan {
  Free = 'FREE',
  Startup = 'STARTUP',
  Business = 'BUSINESS',
}

export interface SubscriptionData {
  usersCount: number
  subscription: Subscription
}

export type Subscription = SubscriptionOverview & {
  payment?: SubscriptionPayment
}

export interface SubscriptionOverview {
  plan: SubscriptionPlan
  billingCycleAnchor: string
  handoverSentAt?: string | null

  cancelAt?: string
  downgradeAt?: string

  canceledAt?: string
  downgradedAt?: string
}

export interface SubscriptionPayment {
  taxId: string | null
  card: PaymentCard
}

export interface PaymentCard {
  brand: string
  last4: string
  expired?: boolean
  expiration: {
    year: number
    month: number
  }
}
