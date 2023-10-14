export interface EnvChangelogItem {
  id: string
  createdAt: string
  secretsChanges?: SecretsChange[]
  // TODO: user
}

export interface SecretsChange {
  secretKey: string
  newValue: string | null
  oldValue: string | null
}
