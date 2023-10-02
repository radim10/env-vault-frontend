'use client'

import React, { useState } from 'react'
import TypographyH4 from '../typography/TypographyH4'
import { Button } from '../ui/button'
import Error from '@/components/Error'
import { Icons } from '../icons'
import { CreateWorkspaceTokenDialog } from './CreateWorkspaceTokenDialog'
import { useGetWorkspaceTokens } from '@/api/queries/projects/tokens'
import { Skeleton } from '../ui/skeleton'
import AccessTable from '../environments/access/AccessTable'
import { WorkspaceToken } from '@/types/workspaceTokens'
import { useToast } from '../ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import RevokeTokenDialog from '../environments/access/RevokeTokenDialog'

interface Props {
  workspaceId: string
}

const WorkspaceTokens: React.FC<Props> = ({ workspaceId }) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [dialogOpened, setDialogOpened] = useState(false)
  const [revokeDialog, setRevokeDialog] = useState<{ id: string; name: string } | null>(null)

  const { data, isLoading, error } = useGetWorkspaceTokens({
    workspaceId,
  })

  const getCacheData = (): WorkspaceToken[] | undefined => {
    return queryClient.getQueryData<WorkspaceToken[]>([workspaceId, 'workspace-tokens'])
  }

  const handleNewToken = (args: { name: string; value: string; expiresAt: string | null }) => {
    setDialogOpened(false)

    const data = getCacheData()

    if (data) {
      queryClient.setQueryData<WorkspaceToken[]>(
        [workspaceId, 'workspace-tokens'],
        (oldData: WorkspaceToken[] | any) => {
          if (oldData) {
            return [{ ...args, revoked: false, createdAt: dayjs().toDate() }, ...oldData]
          } else {
            return [args]
          }
        }
      )
    }

    toast({
      title: 'New token created!',
      variant: 'success',
    })
  }

  const handleRevokedToken = (tokenId: string) => {
    closeRevokeDialog()

    const data = getCacheData()

    if (data) {
      const newData = [...data].filter(({ id }) => id !== tokenId)

      queryClient.setQueryData<WorkspaceToken[]>([workspaceId, 'workspace-tokens'], newData)
    }

    toast({
      title: 'Token has been revoked!',
      variant: 'success',
    })
  }

  const closeRevokeDialog = () => {
    if (!revokeDialog) return

    setRevokeDialog({ ...revokeDialog, id: '' })
    setTimeout(() => {
      setRevokeDialog(null)
    }, 150)
  }

  if (isLoading) {
    return <Skeleton className="mt-2 border-2 h-72 w-full" />
  }

  if (error) {
    return <Error />
  }

  return (
    <>
      <CreateWorkspaceTokenDialog
        workspaceId={workspaceId}
        opened={dialogOpened}
        onClose={() => setDialogOpened(false)}
        onSuccess={handleNewToken}
      />

      {revokeDialog && (
        <RevokeTokenDialog
          workspaceId={workspaceId}
          tokenId={revokeDialog?.id}
          tokenName={revokeDialog?.name}
          opened={revokeDialog?.id?.length > 0}
          onClose={closeRevokeDialog}
          description={
            'If you revoke this token, you will no longer have access to the workspace projects with this token.'
          }
          onSuccess={() => handleRevokedToken(revokeDialog.id)}
        />
      )}

      <div>
        <div className="mt-2 gap-2 rounded-md border-2">
          <div className="px-3 py-3 md:px-5 md:py-4">
            <div className="flex items-center justify-between">
              <TypographyH4>Workspace tokens (SDKs)</TypographyH4>

              <Button
                variant={'outline'}
                size={'sm'}
                className="gap-2 hidden md:flex"
                onClick={() => setDialogOpened(true)}
              >
                <Icons.plus className="h-4 w-4" />
                Add new
              </Button>
            </div>
            {/* // */}
            <div className="text-[0.95rem] text-muted-foreground mt-2">
              Workspace tokens are used with SDKs to access selected projects in the workspace and
              all content in those projects (environments, secrets).
            </div>
          </div>
          {/* // TABLE */}
          <AccessTable data={data} onRevoke={setRevokeDialog} />
        </div>
      </div>
    </>
  )
}

export default WorkspaceTokens
