import { useMutation } from '@tanstack/react-query'
import {
  RenameEnvironmentError,
  RenameEnvironmentResData,
  renameEnvironment,
} from '../requests/projects/environments/environments'
import { MutOpt } from './mutOpt'

// create
type RenameEnvironmentVariables = {
  workspaceId: string
  projectName: string
  envName: string
  data: {
    name: string
  }
}

export const useRenameEnvironment = (opt?: MutOpt<RenameEnvironmentResData>) =>
  useMutation<RenameEnvironmentResData, RenameEnvironmentError, RenameEnvironmentVariables>(
    renameEnvironment,
    opt
  )
