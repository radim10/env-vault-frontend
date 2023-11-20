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
import { EnvironmentToken } from '@/types/tokens/environment'
import dayjs from 'dayjs'
import { useToast } from '@/components/ui/use-toast'
import RevokeTokenDialog from './RevokeTokenDialog'
import Error from '@/components/Error'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import { FullToken } from '@/types/tokens/token'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

// const AccessRoot: React.FC<Props> = (props) => {
//   const { isMemberRole } = useSelectedEnvironmentStore()
//
//   const currentView = {
//     Admin: <Access {...props} />,
//     Member: (
//       <>
//         <div>
//           <div className="flex items-center justify-center mt-24">
//             <div className="flex flex-col items-center gap-2">
//               <div>
//                 <Icons.ban className="h-20 w-20 opacity-30" />
//               </div>
//               <div className="text-center">
//                 <span className="text-lg font-bold opacity-85">Missing permission</span>
//                 <div className="my-1 text-muted-foreground">
//                   Yout must be project admin/owner to access environment tokens
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     ),
//   }[isMemberRole() ? 'Member' : 'Admin']
//
//   return <>{currentView}</>
// }
//
const Access: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  const { isAdminRole } = useSelectedEnvironmentStore()

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

  const handleNewToken = (
    tokenData: Omit<EnvironmentToken, 'tokenPreview'> & { fullToken: string }
  ) => {
    // setDialogOpened(false)
    const data = getCacheData()

    if (data) {
      queryClient.setQueryData<EnvironmentToken[]>(
        [workspaceId, projectName, envName, 'tokens'],
        (oldData: EnvironmentToken[] | any) => {
          if (oldData) {
            return [{ ...tokenData, tokenPreview: tokenData?.fullToken?.slice(0, 10) }, ...oldData]
          } else {
            return [tokenData]
          }
        }
      )
    }

    // full value
    queryClient.setQueryData<FullToken>(
      [workspaceId, projectName, envName, 'tokens', tokenData?.id],
      {
        token: tokenData?.fullToken,
      }
    )

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
        readOnly={!isAdminRole()}
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
            <>
              <Button
                variant={'outline'}
                size={'sm'}
                className="gap-2 hidden md:flex"
                onClick={() => setDialogOpened(true)}
              >
                <Icons.plus className="h-4 w-4" />
                Add new
              </Button>
            </>
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
        {/* <AccessTable data={tokens} onRevoke={!isMemberRole() ? setRevokeDialog : undefined} /> */}
        <AccessTable
          queryClient={queryClient}
          data={tokens}
          onRevoke={setRevokeDialog}
          disableRevokeWriteAccess={!isAdminRole()}
        />
      </div>
    </>
  )
}

export default Access
