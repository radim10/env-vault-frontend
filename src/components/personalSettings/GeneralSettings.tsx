'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Icons } from '../icons'
import DangerZone from '../DangerZone'
import { Button } from '@/components/ui/button'
import WorkspacePreferences from './WorkspacePreferences'
import useCurrentUserStore from '@/stores/user'
import PersonalSettingsLayout from './Layout'
import { useUpdateUserProfile } from '@/api/mutations/currentUser'
import { useToast } from '../ui/use-toast'
import { currentUserErrorMsgFromCode } from '@/api/requests/currentUser'
import ChangeEmailDialog from './ChangeEmailDialog'
import { useGetPendingEmail } from '@/api/queries/userAuth'
import { Skeleton } from '../ui/skeleton'
import { useDebounce } from 'react-use'
import { useDeletePendingEmail } from '@/api/mutations/userAuth'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import ProfileSection from './ProfileSection'

const GeneralSettings = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { data: currentUser, update: updateCurrentUser } = useCurrentUserStore()

  const [deletePendingEmailClicked, setDeletePendingEmailClicked] = useState(false)
  const [editActive, setEditActive] = useState(false)
  const [changeEmailDialogOpened, setChangeEmailDialogOpened] = useState<null | boolean>(null)

  const [newName, setNewName] = useState('')

  useDebounce(
    () => {
      if (deletePendingEmailClicked) {
        if (!isDeletePendingEmailLoading) {
          setDeletePendingEmailClicked(false)
        }
      }
    },
    3000,
    [deletePendingEmailClicked]
  )

  const { isLoading: isDeletePendingEmailLoading, mutate: deletePendingEmailMutate } =
    useDeletePendingEmail({
      onError: () => {
        setDeletePendingEmailClicked(false)
        toast({
          title: 'Error',
          description: 'Something went wrong.',
          variant: 'destructive',
        })
      },
      onSuccess: () => {
        toast({
          title: 'Pending new meail deleted',
          variant: 'success',
        })

        queryClient.setQueryData([currentUser?.id, 'pending-email'], {
          pendingEmail: null,
        })
      },
    })

  const {
    data: pendingEmailData,
    isLoading: isPendingEmailLoading,
    error: pendingEmailError,
    refetch,
  } = useGetPendingEmail(currentUser?.id ?? '')

  const handleToggleEdit = (active: boolean) => {
    if (active) {
      setNewName(currentUser?.name ?? '')
    } else {
      setNewName('')
    }
    setEditActive(!editActive)
  }

  const {
    mutate: updateUserProfile,
    error: updateUserProfileError,
    isLoading,
  } = useUpdateUserProfile({
    onSuccess: () => {
      setEditActive(false)
      updateCurrentUser({ name: newName })

      setNewName('')
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
        variant: 'success',
      })
    },
  })

  const closeChangeEmailDialog = () => {
    if (!changeEmailDialogOpened) return

    setChangeEmailDialogOpened(false)
    setTimeout(() => {
      setChangeEmailDialogOpened(null)
    }, 150)
  }

  const handleEmailChange = (newEmail: string) => {
    closeChangeEmailDialog()

    queryClient.setQueryData([currentUser?.id, 'pending-email'], {
      pendingEmail: newEmail,
    })

    toast({
      title: 'Email confirmation sent',
      description: 'We have sent a confirmation link to your new email address',
      variant: 'success',
    })
  }

  return (
    <>
      {changeEmailDialogOpened !== null && (
        <ChangeEmailDialog
          opened={changeEmailDialogOpened !== false}
          onClose={() => closeChangeEmailDialog()}
          onSuccess={handleEmailChange}
        />
      )}
      <div className="flex flex-col gap-7 mt-6">
        <ProfileSection />
        {/* // */}

        <WorkspacePreferences />

        {/* // */}
        <DangerZone
          btn={{
            onClick: () => {},
            disabled: false,
          }}
          title="Delete my account"
          description="Permanently delete this account, cannot be undone"
        />
      </div>
    </>
  )
}

export default GeneralSettings
