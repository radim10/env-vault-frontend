export enum EnvironmentType {
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export interface Environment {
  createdAt: string
  name: string
  locked: boolean
  type: EnvironmentType
}

export enum EnvSortOption {
  CreatedDesc = 'Created desc',
  CreatedAsc = 'Created asc',
  SecretsCountDesc = 'Secrets count desc',
  SecretsCountAsc = 'Secrets count asc',
  AlphabeticalAsc = 'Alphabetical asc',
  AlphabeticalDesc = 'Alphabetical desc',
}

export enum EnvGroupBy {
  Lock = 'Lock',
  Type = 'Type',
}
