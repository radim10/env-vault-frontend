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
  change?: EnvChange
  user?: {
    name: string
    avatarUrl: string | null
  }
  secrets: SecretsChange[]
  // TODO: user
}

type SecretChange =
  | NewSecretsChange
  | RenamedSecretsChange
  | UpdatedSecretChange
  | DeletedSecretsChange

export type NewSecretsChange = {
  newKey: string
  newValue: string
}

export type RenamedSecretsChange = {
  oldKey: string
  newKey: string
  value: string
}

export type UpdatedSecretChange = {
  key: string
  oldValue: string
  newValue: string
}

export type DeletedSecretsChange = {
  oldKey: string
  oldValue: string
}

// export type EnvChange =
//   | SecretsEnvChage
//   | CreatedEnvChange
//   | RenamedEnvChange
//   | UpdatedEnvDescription
//   | LockedEnvChange
//   | EnvTypeChange
//
// export type SecretsEnvChage = {
//   action: 'secrets'
//   data: Array<SecretsChange>
// }
//
//
export type EnvChange =
  | CreatedEnvChange
  | RenamedEnvChange
  | UpdatedEnvDescription
  | LockedEnvChange
  | EnvTypeChange

export interface SecretsChange {
  key?: string
  oldKey?: string
  newKey?: string

  value?: string
  oldValue?: string
  newValue?: string
}

// export interface SecretsChange {
//   key: string
//   old?: string
//   new?: string
//   // only renamed
//   newKey?: string
//   value?: string
// }

export type CreatedEnvChange = {
  action: 'created'
}

export type RenamedEnvChange = {
  action: 'renamed'
  new: string
  old: string
}

export type UpdatedEnvDescription = {
  action: 'description'
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
