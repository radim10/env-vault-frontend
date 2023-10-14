import { useMutation } from '@tanstack/react-query'
import {
  RollbackEnvChangeReqArgs,
  RollbackEnvChangelogError,
  RollbackEnvChangelogResData,
  rollbackEnvChangelog,
} from '../requests/envChangelog'
import { MutOpt } from './mutOpt'

// create
type RollbackEnvChangeVariables = RollbackEnvChangeReqArgs

export const useRollbackEnvChange = (opt?: MutOpt<RollbackEnvChangelogResData>) =>
  useMutation<RollbackEnvChangelogResData, RollbackEnvChangelogError, RollbackEnvChangeVariables>(
    rollbackEnvChangelog,
    opt
  )
