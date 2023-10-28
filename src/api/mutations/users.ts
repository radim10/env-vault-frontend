import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'
import {
  DeleteWorkspaceUserError,
  UpdateWorkspaceUserRoleArgs,
  UpdateWorkspaceUserRoleError,
  UpdateWorkspaceUserRoleResData,
  deleteWorkspaceUser,
  updateWorkspaceUserRole,
} from '../requests/users'

// update role
type UpdateWorkspaceUserRoleVariables = UpdateWorkspaceUserRoleArgs

export const useUpdateWorkspaceUserRole = (opt?: MutOpt<UpdateWorkspaceUserRoleResData>) =>
  useMutation<
    UpdateWorkspaceUserRoleResData,
    UpdateWorkspaceUserRoleError,
    UpdateWorkspaceUserRoleVariables
  >(updateWorkspaceUserRole, opt)

// delete
type DeleteWorkspaceUserVariables = {
  workspaceId: string
  userId: string
}

export const useDeleteWorkspaceUser = (opt?: MutOpt<undefined>) =>
  useMutation<undefined, DeleteWorkspaceUserError, DeleteWorkspaceUserVariables>(
    ['delete-user'],
    deleteWorkspaceUser,
    opt
  )
