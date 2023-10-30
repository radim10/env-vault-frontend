import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'
import {
  CreateWorkspaceInvitationArgs,
  CreateWorkspaceInvitationError,
  CreateWorkspaceInvitationResData,
  DeleteWorkspaceInvitationArgs,
  DeleteWorkspaceInvitationError,
  DeleteWorkspaceInvitationResData,
  DeleteWorkspaceUserError,
  ResendWorkspaceInvitationArgs,
  ResendWorkspaceInvitationError,
  ResendWorkspaceInvitationResData,
  UpdateWorkspaceUserRoleArgs,
  UpdateWorkspaceUserRoleError,
  UpdateWorkspaceUserRoleResData,
  createWorkspaceInvitation,
  deleteWorkspaceInvitation,
  deleteWorkspaceUser,
  resendWorkspaceInvitation,
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

// delete workspace invitation
type DeleteWorkspaceInvitationVariables = DeleteWorkspaceInvitationArgs

export const useDeleteWorkspaceInvitation = (opt?: MutOpt<DeleteWorkspaceInvitationResData>) =>
  useMutation<
    DeleteWorkspaceInvitationResData,
    DeleteWorkspaceInvitationError,
    DeleteWorkspaceInvitationVariables
  >(deleteWorkspaceInvitation, opt)

type ResendWorkspaceInvitationVariables = ResendWorkspaceInvitationArgs

export const useResendWorkspaceInvitation = (opt?: MutOpt<ResendWorkspaceInvitationResData>) =>
  useMutation<
    ResendWorkspaceInvitationResData,
    ResendWorkspaceInvitationError,
    ResendWorkspaceInvitationVariables
  >(resendWorkspaceInvitation, opt)

// delete workspace user
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
