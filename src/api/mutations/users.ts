import { MutOpt } from './mutOpt'
import { useMutation } from '@tanstack/react-query'
import { DeleteWorkspaceUserError, deleteWorkspaceUser } from '../requests/users'

// update
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
