'use client'

import { useGetCliTokens } from '@/api/queries/projects/tokens'
import { Skeleton } from '../ui/skeleton'
import Error from '@/components/Error'
import TypographyH4 from '../typography/TypographyH4'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Icons } from '../icons'
import CliTokensTable from './CliTokensTable'
import RevokeCliTokenDialog from './RevokeCliTokenDialog'
import { CliToken } from '@/types/tokens/cli'
import { useToast } from '../ui/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import CreateCliTokenDialog from './GenerateCliTokenDialog'

interface Props {
  workspaceId: string
}

const CliTokens: React.FC<Props> = ({ workspaceId }) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [dialogOpened, setDialogOpened] = useState(false)
  const [revokeDialog, setRevokeDialog] = useState<{ id: string } | null>(null)

  const { data, isLoading, error } = useGetCliTokens({
    workspaceId,
  })

  const getCacheData = (): CliToken[] | undefined => {
    return queryClient.getQueryData<CliToken[]>([workspaceId, 'cli-tokens'])
  }

  const handleRevokedToken = (tokenId: string) => {
    closeRevokeDialog()

    const data = getCacheData()

    if (data) {
      const newData = [...data].filter(({ id }) => id !== tokenId)

      queryClient.setQueryData<CliToken[]>([workspaceId, 'cli-tokens'], newData)
    }

    toast({
      title: 'Token has been revoked!',
      variant: 'success',
    })
  }

  const handleNewToken = (args: { id: string; value: string; name: string }) => {
    setDialogOpened(false)

    const data = getCacheData()

    if (data) {
      queryClient.setQueryData<CliToken[]>(
        [workspaceId, 'cli-tokens'],
        (oldData: CliToken[] | any) => {
          if (oldData) {
            return [{ ...args }, ...oldData]
          } else {
            return [args]
          }
        }
      )
    }

    toast({
      title: 'New token created!',
      description: 'Token has been copied to clipboard',
      variant: 'success',
    })

    copyToken(args.value, false)
  }

  const copyToken = (token: string, showToast: boolean) => {
    navigator.clipboard.writeText(token)
    if (!showToast) return

    toast({
      title: 'Token copied to clipboard!',
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
      <CreateCliTokenDialog
        opened={dialogOpened}
        workspaceId={workspaceId}
        onClose={() => setDialogOpened(false)}
        onSuccess={handleNewToken}
      />
      {revokeDialog && (
        <RevokeCliTokenDialog
          workspaceId={workspaceId}
          tokenId={revokeDialog?.id}
          opened={revokeDialog?.id?.length > 0}
          onClose={closeRevokeDialog}
          onSuccess={() => handleRevokedToken(revokeDialog.id)}
        />
      )}
      <div>
        <div className="mt-2 gap-2 rounded-md border-2">
          <div className="px-3 py-3 md:px-5 md:py-4">
            <div className="flex items-center justify-between">
              <div className="gap-3 flex items-center">
                <TypographyH4>Cli tokens</TypographyH4>
                <Icons.terminalSquare className="h-5 w-5 opacity-80" />
              </div>

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
              Cli tokens are used with cli to access selected worksapace on the behalf of the user
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
          <CliTokensTable
            data={data}
            queryClient={queryClient}
            workspaceId={workspaceId}
            onRevoke={(id) => setRevokeDialog({ id })}
            onCopyToken={(token) => copyToken(token, true)}
          />
        </div>
      </div>
    </>
  )
}

export default CliTokens
