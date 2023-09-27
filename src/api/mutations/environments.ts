import { useMutation } from '@tanstack/react-query'
import {
  CreateEnvironmentError,
  CreateEnvironmentResData,
  DeleteEnvironmentError,
  DeleteEnvironmentResData,
  LockEnvironmentError,
  LockEnvironmentResData,
  RenameEnvironmentError,
  RenameEnvironmentResData,
  UpdateEnvironmentTypeError,
  UpdateEnvironmentTypeResData,
  createEnvironment,
  deleteEnvironment,
  lockEnvironment,
  renameEnvironment,
  updateEnvironmentType,
} from '../requests/projects/environments/environments'
import { MutOpt } from './mutOpt'
import { EnvironmentType } from '@/types/environments'

// create
type CreateEnvironmentVariables = {
  workspaceId: string
  projectName: string
  data: {
    name: string
    type: EnvironmentType
  }
}

export const useCreateEnvironment = (opt?: MutOpt<CreateEnvironmentResData>) =>
  useMutation<CreateEnvironmentResData, CreateEnvironmentError, CreateEnvironmentVariables>(
    createEnvironment,
    opt
  )

// lock/unlock
type LockEnvironmentVariables = {
  lock: boolean
  workspaceId: string
  projectName: string
  envName: string
}

export const useLockEnvironment = (opt?: MutOpt<LockEnvironmentResData>) =>
  useMutation<LockEnvironmentResData, LockEnvironmentError, LockEnvironmentVariables>(
    lockEnvironment,
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

// update type
type UpdateEnvironmentTypeVariables = {
  workspaceId: string
  projectName: string
  envName: string
  data: {
    type: EnvironmentType
  }
}

export const useUpdateEnvironmentType = (opt?: MutOpt<UpdateEnvironmentTypeResData>) =>
  useMutation<
    UpdateEnvironmentTypeResData,
    UpdateEnvironmentTypeError,
    UpdateEnvironmentTypeVariables
  >(updateEnvironmentType, opt)
//

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
