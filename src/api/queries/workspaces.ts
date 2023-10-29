import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import { getWorkspace, GetWorkspaceData, GetWorkspaceError, getWorkspaceInvitation, GetWorkspaceInvitationLinksData, GetWorkspaceInvitationLinksError } from '../requests/workspaces'

export const useGetWorkspace = (
  id: string,
  opt?: UseQueryOptions<GetWorkspaceData, GetWorkspaceError>
) =>
  useQuery<GetWorkspaceData, GetWorkspaceError>(
    ['workspace', id],
    () => {
      return getWorkspace(id)
    },
    opt
  )


export const useGetWorkspaceInvitationLinks = (
  id: string,
  opt?: UseQueryOptions<GetWorkspaceInvitationLinksData, GetWorkspaceInvitationLinksError>
) =>
  useQuery<GetWorkspaceInvitationLinksData, GetWorkspaceInvitationLinksError>(
    ['workspace-invitation',  id],
    () => {
      return getWorkspaceInvitation(id)
    },
    opt
  )
