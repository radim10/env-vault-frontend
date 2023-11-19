'use client'

import React, { useState } from 'react'
import TypographyH4 from '../typography/TypographyH4'
import { Button } from '../ui/button'
import Error from '@/components/Error'
import { Icons } from '../icons'
import { CreateWorkspaceTokenDialog } from './CreateWorkspaceTokenDialog'
import { useGetWorkspaceTokens } from '@/api/queries/projects/tokens'
import { Skeleton } from '../ui/skeleton'
import { WorkspaceToken } from '@/types/tokens/workspace'
import { useToast } from '../ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import RevokeTokenDialog from '../environments/access/RevokeTokenDialog'
import useCurrentUserStore from '@/stores/user'
import WorkspaceTokensTable from './WorkspaceTokensTable'
import { FullToken } from '@/types/tokens/token'

interface Props {
  workspaceId: string
}

const WorkspaceTokensRoot: React.FC<Props> = ({ workspaceId }) => {
  const { isMemberRole } = useCurrentUserStore()

  const currentView = {
    Admin: <WorkspaceTokens workspaceId={workspaceId} />,
    Member: (
      <>
        <div>
          <div className="flex items-center justify-center mt-28">
            <div className="flex flex-col items-center gap-2">
              <div>
                <Icons.ban className="h-20 w-20 opacity-30" />
              </div>
              <div className="text-center">
                <span className="text-lg font-bold opacity-85">Missing permission</span>
                <div className="my-1">Yout must be admin/owner to access workspace tokens</div>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
  }[isMemberRole() ? 'Member' : 'Admin']

  return <>{currentView}</>
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

  const handleNewToken = (
    tokenData: Omit<WorkspaceToken, 'tokenPreview'> & { fullToken: string }
  ) => {
    // setDialogOpened(false)
    const data = getCacheData()

    if (data) {
      queryClient.setQueryData<WorkspaceToken[]>(
        [workspaceId, 'workspace-tokens'],
        (oldData: WorkspaceToken[] | any) => {
          if (oldData) {
            return [{ ...tokenData, tokenPreview: tokenData?.fullToken?.slice(0, 10) }, ...oldData]
          } else {
            return [tokenData]
          }
        }
      )
    }

    queryClient.setQueryData<FullToken>([workspaceId, 'workspace-tokens', tokenData?.id], {
      token: tokenData?.fullToken,
    })

    // toast({
    //   title: 'New token created!',
    //   variant: 'success',
    // })
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

            <Button
              size={'sm'}
              variant={'outline'}
              className="mt-3.5 mb-2 gap-2 md:hidden flex w-full"
              onClick={() => setDialogOpened(true)}
            >
              <Icons.plus className="h-4 w-4" />
              Add new
            </Button>
          </div>
          {/* // TABLE */}
          <WorkspaceTokensTable
            queryClient={queryClient}
            workspaceId={workspaceId}
            data={data}
            onRevoke={setRevokeDialog}
          />
        </div>
      </div>
    </>
  )
}

export default WorkspaceTokensRoot
