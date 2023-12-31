'use client'

import dayjs from 'dayjs'
import { LucideIcon } from 'lucide-react'
import relativeTime from 'dayjs/plugin/relativeTime'

import Error from '../Error'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'
import NotFound from '../projects/NotFound'
import TypographyH4 from '../typography/TypographyH4'
import { useGetWorkspace } from '@/api/queries/workspaces'
import DangerZone from '../DangerZone'
import { useState } from 'react'
import MultiDangerZone from '../MultiDangerZone'
import LeaveWorkspaceDialog from './LeaveWorkspaceDialog'
import { useQueryClient } from '@tanstack/react-query'
import useCurrentUserStore from '@/stores/user'
import DeleteWorkspaceDialog from './DeleteWorkspaceDialog'
import { useToast } from '../ui/use-toast'

dayjs.extend(relativeTime)

///

interface Props {
  workspaceId: string
}

const generalItems: Array<{
  label: string
  icon: LucideIcon
}> = [
  {
    icon: Icons.clock4,
    label: 'Created at',
  },
  {
    icon: Icons.user,
    label: 'Super admin',
  },
  {
    icon: Icons.fileText,
    label: 'Name',
  },
]

// TODO: workspace actions based on user role
const WorkspaceSettings: React.FC<Props> = ({ workspaceId }) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useGetWorkspace(workspaceId)
  const [leaveDialog, setLeaveDialog] = useState<boolean | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<boolean | null>(null)

  const currentUser = useCurrentUserStore((state) => state.data)
  const { isOwnerRole } = useCurrentUserStore((state) => state)

  if (isLoading) {
    return <Skeleton className="mt-2 border-2 h-64 w-full" />
  }

  if (error) {
    if (error?.code === 'workspace_not_found') {
      return (
        <NotFound
          title="Workspace not found"
          description="Looks like this workspace doesn't exist"
        />
      )
    } else {
      return <Error />
    }
  }

  const handleLeaveWorkspace = () => {
    closeLeaveDialog()
    queryClient.refetchQueries(['current-user'])

    toast({
      title: 'Workspace left',
      description: 'You have successfully left the workspace',
      variant: 'success',
    })
  }

  const handleDeletedWorkspace = () => {
    closeLeaveDialog()
    queryClient.refetchQueries(['current-user'])

    toast({
      title: 'Workspace deleted',
      description: 'You have successfully deleted the workspace',
      variant: 'success',
    })
  }

  const closeLeaveDialog = () => {
    if (!leaveDialog) return

    setLeaveDialog(false)
    setTimeout(() => {
      setLeaveDialog(null)
    }, 150)
  }

  const closeDeleteDialog = () => {
    if (!deleteDialog) return

    setDeleteDialog(false)
    setTimeout(() => {
      setDeleteDialog(null)
    }, 150)
  }

  return (
    <>
      {leaveDialog !== null && (
        <LeaveWorkspaceDialog
          workspaceName={currentUser?.selectedWorkspace?.name ?? ''}
          opened={leaveDialog === true}
          workspaceId={workspaceId}
          onClose={() => closeLeaveDialog()}
          onSuccess={() => handleLeaveWorkspace()}
        />
      )}

      {deleteDialog !== null && (
        <DeleteWorkspaceDialog
          workspaceName={currentUser?.selectedWorkspace?.name ?? ''}
          opened={deleteDialog === true}
          workspaceId={workspaceId}
          onClose={() => closeDeleteDialog()}
          onSuccess={() => handleDeletedWorkspace()}
        />
      )}

      <div className="flex flex-col gap-7">
        <div className="mt-2 gap-2 rounded-md border-2">
          <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4">
            <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6">
              <TypographyH4>Workspace settings</TypographyH4>
              <Icons.settings2 className="h-5 w-5 opacity-80" />
            </div>
            {/* // */}
            <div className="text-[0.95rem] text-muted-foreground mt-2 md:mt-0 px-3 md:px-6 lg:px-6">
              Modify/edit this workspace
            </div>

            <div className="mt-7 flex flex-col gap-2.5 text-[0.96rem] ox-0">
              {generalItems.map(({ label, icon: Icon }, index) => (
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 text-md md:justify-between px-4 md:px-10 md:h-8">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Icon className="h-4 w-4 opacity-80" />
                      <span className="font-semibold text-[0.96rem]">{label}</span>
                    </div>
                    <div>
                      {label === 'Created at' && (
                        <span>{dayjs(data?.createdAt).format('YYYY-MM-DD HH:mm')}</span>
                      )}
                      {label === 'Super admin' && <span>@dimak00 (you)</span>}
                      {label === 'Name' && (
                        <div className="flex justify-between md:justify-start items-center gap-3 md:gap-6">
                          <span>{data?.name}</span>
                          <Button size={'sm'} variant={'outline'}>
                            <Icons.pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {index !== generalItems.length - 1 && <Separator />}
                </>
              ))}
            </div>
          </div>
        </div>
        {/* //  */}
        {isOwnerRole() && (
          <MultiDangerZone
            items={[
              {
                btn: {
                  text: 'Leave',
                  variant: 'outline',
                  onClick: () => setLeaveDialog(true),
                },
                title: 'Leave worksapce',
                description: 'You will no longer be able to access this workspace',
              },

              {
                btn: {
                  text: 'Delete',
                  onClick: () => setDeleteDialog(true),
                },
                title: 'Delete workspace',
                description: 'Permanently delete this workspace, irreversible action',
              },
            ]}
          />
        )}

        {!isOwnerRole() && (
          <DangerZone
            title={'Leave workspace'}
            description={'You will no longer be able to access this workspace'}
            btn={{
              text: 'Leave',
              onClick: () => setLeaveDialog(true),
            }}
          />
        )}
      </div>
    </>
  )
}

export default WorkspaceSettings
