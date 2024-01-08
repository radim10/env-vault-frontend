// export enum SubscriptionPlan {
//   Free = 'FREE',
//   Startup = 'STARTUP',
//   Business = 'BUSINESS',
// }

export enum SubscriptionPlan {
  FREE = 'FREE',
  STARTUP = 'STARTUP',
  BUSINESS = 'BUSINESS',
}

export function subscriptionPlanToString(plan: SubscriptionPlan) {
  if (plan === 'FREE') {
    return 'Free'
  } else if (plan === 'STARTUP') {
    return 'Startup'
  } else if (plan === 'BUSINESS') {
    return 'Business'
  }
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
  customerName: string
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

export interface Invoice {
  createdAt: Date
  number: string | null
  amount: number
  url?: string | null
}
