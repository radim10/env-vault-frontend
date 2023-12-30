export interface CliToken {
  id: string
  createdAt: string
  lastUsedAt: string | null
  // value: string
  last5: string
  name: string
}
