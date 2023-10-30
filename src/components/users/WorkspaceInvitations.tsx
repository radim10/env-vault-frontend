'use client'

import { useQueryClient } from '@tanstack/react-query'
import InviteUserDialog from './InviteUserDialog'
import { useState } from 'react'
import InvitationsTable from './invitationsTable/InvitationsTable'
import { invitationsColumns } from './invitationsTable/Columns'

interface Props {
  workspaceId: string
}

const WorkspaceInvitations: React.FC<Props> = ({ workspaceId }) => {
  const queryClient = useQueryClient()
  const [inviteUserDialog, setInviteUserDialog] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <InviteUserDialog
        queryClient={queryClient}
        workspaceId={workspaceId}
        opened={inviteUserDialog}
        onClose={() => setInviteUserDialog(false)}
        onEmailInvite={() => { }}
      />
      {/**/}
      <InvitationsTable
        workspaceId={workspaceId}
        columns={invitationsColumns as any}
        queryClient={queryClient}
        onInviteUser={() => setInviteUserDialog(true)}
      />
    </div>
  )
}

export default WorkspaceInvitations
