export enum EnvironmentType {
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export interface Environment {
  name: string
  locked: boolean
  type: EnvironmentType
}
