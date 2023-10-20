import { useMutation } from '@tanstack/react-query'
import {
  RevertEnvChangeReqArgs,
  RevertEnvChangelogError,
  RevertEnvChangelogResData,
  revertEnvChange,
} from '../requests/envChangelog'
import { MutOpt } from './mutOpt'

// create
type RevertEnvChangeVariables = RevertEnvChangeReqArgs

export const useRevertEnvChange = (opt?: MutOpt<RevertEnvChangelogResData>) =>
  useMutation<RevertEnvChangelogResData, RevertEnvChangelogError, RevertEnvChangeVariables>(
    revertEnvChange,
    opt
  )
