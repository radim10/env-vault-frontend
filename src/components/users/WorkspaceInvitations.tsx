'use client'

import { useQueryClient } from '@tanstack/react-query'
import InviteUserDialog from './InviteUserDialog'
import { useState } from 'react'
import InvitationsTable from './invitationsTable/InvitationsTable'
import { useUnmount } from 'react-use'
import { useInvitationsStore } from '@/stores/invitations'
import useInvitationsTableColumns from './invitationsTable/Columns'
import useCurrentUserStore from '@/stores/user'

interface Props {
  workspaceId: string
}

const WorkspaceInvitations: React.FC<Props> = ({ workspaceId }) => {
  const queryClient = useQueryClient()
  const [inviteUserDialog, setInviteUserDialog] = useState(false)
  const invitationsStore = useInvitationsStore()
  const { isMemberRole } = useCurrentUserStore()

  useUnmount(() => {
    invitationsStore.reset()
  })

  return (
    <div className="flex flex-col gap-6">
      <InviteUserDialog
        queryClient={queryClient}
        workspaceId={workspaceId}
        opened={inviteUserDialog}
        onClose={() => setInviteUserDialog(false)}
        onEmailInvite={() => {}}
      />
      {/**/}
      <InvitationsTable
        workspaceId={workspaceId}
        columns={useInvitationsTableColumns()}
        queryClient={queryClient}
        onInviteUser={isMemberRole() ? undefined : () => setInviteUserDialog(true)}
      />
    </div>
  )
}

export default WorkspaceInvitations
