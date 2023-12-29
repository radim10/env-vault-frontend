export interface CliToken {
  id: string
  createdAt: string
  lastUsedAt: string | null
  // value: string
  last4: string
  name: string
}
