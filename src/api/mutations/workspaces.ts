import { useMutation } from '@tanstack/react-query'
import { MutOpt } from './mutOpt'
import {
  CreateWorkspaceError,
  CreateWorkspaceResData,
  GenerateWorkspaceInvitationLinkData,
  GenerateWorkspaceInvitationLinkError,
  createWorkspace,
  generateWorkspaceInvitationLink,
} from '../requests/workspaces'

type CreateWorkspaceVariables = {
  name: string
}

export const useCreateWorkspace = (opt?: MutOpt<CreateWorkspaceResData>) =>
  useMutation<CreateWorkspaceResData, CreateWorkspaceError, CreateWorkspaceVariables>(
    ({ name }) => createWorkspace(name),
    opt
  )

// generate invitation link
type GenerateWorkspaceInvitationLinkVariables = {
  workspaceId: string
  type: 'admin' | 'member'
}

export const useGenerateWorkspaceInvitationLink = (
  opt?: MutOpt<GenerateWorkspaceInvitationLinkData>
) =>
  useMutation<
    GenerateWorkspaceInvitationLinkData,
    GenerateWorkspaceInvitationLinkError,
    GenerateWorkspaceInvitationLinkVariables
  >(({ workspaceId, type }) => generateWorkspaceInvitationLink(workspaceId, type), opt)
