'use client'

import React, { useState } from 'react'
import AccessTable from './AccessTable'
import TypographyH4 from '@/components/typography/TypographyH4'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import { GenerateEnvTokenDialog } from './GenerateEnvTokenDialog'
import { useGetEnvironmentTokens } from '@/api/queries/projects/environments/tokens'
import { Skeleton } from '@/components/ui/skeleton'
import { useQueryClient } from '@tanstack/react-query'
import { EnvironmentToken } from '@/types/environmentTokens'
import dayjs from 'dayjs'
import { useToast } from '@/components/ui/use-toast'
import RevokeTokenDialog from './RevokeTokenDialog'
import Error from '@/components/Error'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

const Access: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [dialogOpened, setDialogOpened] = useState(false)
  const [revokeDialog, setRevokeDialog] = useState<{ id: string; name: string } | null>(null)

  const {
    data: tokens,
    isLoading,
    error,
  } = useGetEnvironmentTokens({ workspaceId, projectName, envName })

  const getCacheData = (): EnvironmentToken[] | undefined => {
    return queryClient.getQueryData<EnvironmentToken[]>([
      workspaceId,
      projectName,
      envName,
      'tokens',
    ])
  }

  const handleNewToken = (args: { name: string; value: string; expiresAt: string | null }) => {
    setDialogOpened(false)

    const data = getCacheData()

    if (data) {
      queryClient.setQueryData<EnvironmentToken[]>(
        [workspaceId, projectName, envName, 'tokens'],
        (oldData: EnvironmentToken[] | any) => {
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

      queryClient.setQueryData<EnvironmentToken[]>(
        [workspaceId, projectName, envName, 'tokens'],
        newData
      )
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
    return <Skeleton className="mt-2 border-2 h-48 w-full" />
  }

  if (error) {
    return <Error />
  }

  return (
    <>
      <GenerateEnvTokenDialog
        workspaceId={workspaceId}
        projectName={projectName}
        envName={envName}
        opened={dialogOpened}
        onClose={() => setDialogOpened(false)}
        onSuccess={handleNewToken}
      />

      {revokeDialog && (
        <RevokeTokenDialog
          workspaceId={workspaceId}
          projectName={projectName}
          envName={envName}
          tokenId={revokeDialog?.id}
          tokenName={revokeDialog?.name}
          opened={revokeDialog?.id?.length > 0}
          onClose={closeRevokeDialog}
          onSuccess={() => handleRevokedToken(revokeDialog.id)}
        />
      )}
      <div className="mt-2 gap-2 rounded-md border-2">
        <div className="px-3 py-3 md:px-5 md:py-4">
          <div className="flex items-center justify-between">
            <TypographyH4>Environment tokens (for SDKs)</TypographyH4>
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
          <div className="text-[0.95rem] text-muted-foreground mt-1 md:mt-0">
            Environment tokens are used with SDKs to access only selected environments.
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
        <AccessTable data={tokens} onRevoke={setRevokeDialog} />
      </div>
    </>
  )
}

export default Access
