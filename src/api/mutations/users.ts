import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'
import {
  CreateWorkspaceInvitationArgs,
  CreateWorkspaceInvitationError,
  CreateWorkspaceInvitationResData,
  DeleteWorkspaceUserError,
  UpdateWorkspaceUserRoleArgs,
  UpdateWorkspaceUserRoleError,
  UpdateWorkspaceUserRoleResData,
  createWorkspaceInvitation,
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

// create email workspace invitation
type UseCreateWorkspaceInvitationVariables = CreateWorkspaceInvitationArgs

export const useCreateWorkspaceInvitation = (opt?: MutOpt<CreateWorkspaceInvitationResData>) =>
  useMutation<
    CreateWorkspaceInvitationResData,
    CreateWorkspaceInvitationError,
    UseCreateWorkspaceInvitationVariables
  >(createWorkspaceInvitation, opt)

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
