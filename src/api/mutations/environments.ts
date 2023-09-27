import { useMutation } from '@tanstack/react-query'
import {
  CreateEnvironmentError,
  CreateEnvironmentResData,
  DeleteEnvironmentError,
  DeleteEnvironmentResData,
  RenameEnvironmentError,
  RenameEnvironmentResData,
  createEnvironment,
  deleteEnvironment,
  renameEnvironment,
} from '../requests/projects/environments/environments'
import { MutOpt } from './mutOpt'

// create
type CreateEnvironmentVariables = {
  workspaceId: string
  projectName: string
  data: {
    name: string
  }
}

export const useCreateEnvironment = (opt?: MutOpt<CreateEnvironmentResData>) =>
  useMutation<CreateEnvironmentResData, CreateEnvironmentError, CreateEnvironmentVariables>(
    createEnvironment,
    opt
  )

// rename
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

type DeleteEnvironmentVariables = {
  workspaceId: string
  projectName: string
  envName: string
}

export const useDeleteEnvironment = (opt?: MutOpt<DeleteEnvironmentResData>) =>
  useMutation<DeleteEnvironmentResData, DeleteEnvironmentError, DeleteEnvironmentVariables>(
    deleteEnvironment,
    opt
  )
