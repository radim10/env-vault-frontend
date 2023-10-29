import { useMutation } from '@tanstack/react-query'
import { MutOpt } from './mutOpt'
import {
  GenerateWorkspaceInvitationLinkData,
  GenerateWorkspaceInvitationLinkError,
  generateWorkspaceInvitationLink,
} from '../requests/workspaces'

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
