'use client'

import { useSelectedUserStore } from '@/stores/selectedUser'
import SettingsList from '../SettingsList'
import { Icons } from '../icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import UserRoleBadge from '../users/UserRoleBadge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import DangerZone from '../DangerZone'
import DeleteWorkspaceUserDialog from '../users/DeleteUserDialog'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { GetWorkspaceUserData } from '@/api/requests/users'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'

dayjs.extend(relativeTime)

interface Props {
  workspaceId: string
  userId: string
}

const UserProfile: React.FC<Props> = ({ workspaceId, userId }) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const router = useRouter()

  const { data, reset: resetSelectedUser } = useSelectedUserStore()
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false)

  const closeDialog = () => setDeleteDialogOpened(false)

  const handleDeletedUser = () => {
    const key = ['workspace', workspaceId, 'users', userId]

    const data = queryClient.getQueryData<GetWorkspaceUserData>(key)

    if (data) {
      queryClient.setQueryData(key, null)
    }

    resetSelectedUser()

    toast({
      title: 'User has been deleted',
      variant: 'success',
    })

    router.push(`/workspace/${workspaceId}/users/workspace`)
  }

  if (!data) {
    return <></>
  }

  return (
    <>
      <DeleteWorkspaceUserDialog
        workspaceId={workspaceId}
        opened={deleteDialogOpened}
        user={{ id: data.id, name: data.name }}
        onClose={closeDialog}
        onSuccess={() => handleDeletedUser()}
      />
      <div className="flex flex-col gap-7">
        <SettingsList
          title="User profile"
          description={'Profile of workspace user'}
          icon={Icons.user}
          items={[
            {
              icon: Icons.user,
              label: 'Avatar',
              component: (
                <div className="flex items-center gap-2 md:gap-3">
                  <Avatar className="w-10 h-10 opacity-90">
                    <AvatarImage src={data?.avatarUrl ?? ''} />
                    <AvatarFallback className="bg-transparent border-2 text-sm">
                      {data?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ),
            },

            {
              icon: Icons.tag,
              label: 'Role',

              component: (
                <>
                  <UserRoleBadge role={data?.role} />
                </>
              ),
            },
            {
              icon: Icons.user,
              label: 'Name',
              component: (
                <div className="flex items-center gap-2 md:gap-3">
                  {/* <Avatar className="w-9 h-9 opacity-90"> */}
                  {/*   <AvatarImage src={data?.avatarUrl ?? ''} /> */}
                  {/*   <AvatarFallback className="bg-transparent border-2 text-sm"> */}
                  {/*     {data?.name?.charAt(0).toUpperCase()} */}
                  {/*   </AvatarFallback> */}
                  {/* </Avatar> */}
                  <span className="">{data?.name}</span>
                </div>
              ),
            },

            {
              icon: Icons.mail,
              label: 'Email',
              value: data?.email,
            },

            {
              icon: Icons.clock4,
              label: 'Joined',
              component: (
                <>
                  {dayjs(data?.joinedAt).format('YYYY-MM-DD HH:mm')} (
                  {dayjs(data?.joinedAt).fromNow()})
                </>
              ),
            },
          ]}
        />

        <DangerZone
          btn={{
            onClick: () => setDeleteDialogOpened(true),
            disabled: false,
          }}
          title="Delete user"
          description="Remove this user from current workspace"
        />
      </div>
    </>
  )
}

export default UserProfile
