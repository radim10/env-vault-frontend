export interface Secret {
  key: string
  value: string
}

export interface UpdatedSecret {
  // original key
  key?: string

  newKey?: string
  newValue?: string
  deleted?: boolean
  archived?: boolean
}

export type UpdatedSecretsBody = Array<UpdatedSecret>
