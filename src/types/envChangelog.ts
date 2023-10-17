import { EnvironmentType } from './environments'

// export interface EnvChangelogItem {
//   id: string
//   createdAt: string
//   secretsChanges?: SecretsChange[]
//   change?: EnvChange
//   // TODO: user
// }
//
//
// export interface SecretsChange {
//   secretKey: string
//   newValue: string | null
//   oldValue: string | null
// }
//
// export type EnvChange = RenamedEnvChange | LockedEnvChange | EnvTypeChange

export interface EnvChangelogItem {
  id: string
  createdAt: string
  change: EnvChange
  // TODO: user
}

export type EnvChange = SecretsEnvChage | RenamedEnvChange | LockedEnvChange | EnvTypeChange

export type SecretsEnvChage = {
  action: 'secrets'
  data: Array<SecretsChange>
}

export interface SecretsChange {
  key: string
  old?: string
  new?: string
  // only renamed
  newKey?: string
  value?: string
}

export type RenamedEnvChange = {
  action: 'renamed'
  new: string
  old: string
}

export type LockedEnvChange = {
  action: 'lock'
  locked: boolean
}

export type EnvTypeChange = {
  action: 'type'
  old: EnvironmentType
  new: EnvironmentType
}
