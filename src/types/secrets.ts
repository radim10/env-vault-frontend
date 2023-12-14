export interface Secret {
  key: string
  value: string
  description?: string
}

export interface SecretWithoutValue {
  key: string
  description?: string
}

export interface UpdatedSecret {
  // original key
  key?: string

  newKey?: string
  newValue?: string
  newDescription?: string | null
  deleted?: boolean
  archived?: boolean
}

export type UpdatedSecretsBody = Array<UpdatedSecret>
