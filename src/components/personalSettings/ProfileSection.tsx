'use client'

import clsx from 'clsx'
import { Icons } from '../icons'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useDebounce } from 'react-use'
import { Button } from '@/components/ui/button'
import useCurrentUserStore from '@/stores/user'
import PersonalSettingsLayout from './Layout'
import { useUpdateUserProfile } from '@/api/mutations/currentUser'
import { useToast } from '../ui/use-toast'
import { currentUserErrorMsgFromCode } from '@/api/requests/currentUser'
import ChangeEmailDialog from './ChangeEmailDialog'
import { useGetPendingEmail } from '@/api/queries/userAuth'
import { Skeleton } from '../ui/skeleton'
import { useDeletePendingEmail } from '@/api/mutations/userAuth'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const ProfileSection = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
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

      {isPendingEmailLoading && <Skeleton className="w-full h-72" />}
      {!isPendingEmailLoading && pendingEmailError && (
        <div className="h-44 flex flex-row items-center">
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="text-red-600 text-[0.92rem]">Something went wrong</div>
            <div>
              <Button size={'sm'} variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      )}
      {!isPendingEmailLoading && !pendingEmailError && (
        <PersonalSettingsLayout icon={Icons.userCircle} title="Profile">
          <div className="flex flex-col pb-3">
            <div className="flex flex-col gap-4 justify-center w-full">
              {/* // */}
              <div className="flex flex-row gap-5 md:gap-2 items-center xl:w-2/3">
                <div className="md:w-[18%]">
                  <Label>Avatar</Label>
                </div>
                <Avatar className="w-12 h-12 border-[2.5px] dark:border-gray-800 border-gray-200">
                  <AvatarImage src={currentUser?.avatarUrl ?? ''} />
                  <AvatarFallback>{currentUser?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                <div className="md:w-[20%]">
                  <Label>Full name</Label>
                </div>
                <div className="w-full flex gap-2">
                  <Input
                    disabled={isLoading}
                    readOnly={!editActive}
                    value={!editActive ? currentUser?.name : newName}
                    onChange={(e) => {
                      if (!editActive) return
                      setNewName(e.target.value)
                    }}
                  />

                  {editActive && (
                    <Button
                      className="ease duration-200"
                      variant="secondary"
                      onClick={() => handleToggleEdit(!editActive)}
                      disabled={isLoading}
                    >
                      <Icons.x className="h-4 w-4 opacity-80" />
                    </Button>
                  )}

                  <Button
                    loading={isLoading}
                    variant={editActive ? 'default' : 'outline'}
                    onClick={() => {
                      if (!editActive) {
                        handleToggleEdit(!editActive)
                      } else if (newName && newName !== currentUser?.name) {
                        updateUserProfile({ name: newName })
                      }
                    }}
                    className="ease duration-200"
                    disabled={
                      editActive && (!newName || newName === currentUser?.name || isLoading)
                    }
                  >
                    {!editActive && !isLoading && (
                      <Icons.penSquare className="h-4 w-4 opacity-80" />
                    )}
                    {editActive && !isLoading && <Icons.save className="h-4 w-4 opacity-80" />}
                  </Button>
                </div>
                {/* <Button onClick={() => {}} variant="outline" className="ml-auto"> */}
                {/*   <Icons.penSquare className="h-4 w-4 opacity-80" /> */}
                {/* </Button> */}
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                <div className="md:w-[20%]">
                  <Label>Email</Label>
                </div>
                <div className="w-full flex gap-2">
                  <Input value={currentUser?.email} disabled={editActive} />
                  <Button
                    variant="outline"
                    onClick={() => setChangeEmailDialogOpened(true)}
                    disabled={pendingEmailData?.pendingEmail !== null}
                  >
                    <Icons.penSquare className="h-4 w-4 opacity-80" />
                  </Button>
                </div>
              </div>

              {pendingEmailData?.pendingEmail && (
                <div className="flex flex-col md:flex-row md:items-center xl:w-2/3">
                  <div className="text-[0.92rem] flex  md:flex-row flex-col md:items-center gap-3 mt-0 md:ml-[18%]">
                    <div className="flex gap-2 items-center">
                      <Icons.mail className="h-4 w-4 hidden mb:block" />
                      <span className="text-muted-foreground">
                        Pending email confirmation: {pendingEmailData?.pendingEmail}
                      </span>
                    </div>

                    {!isDeletePendingEmailLoading && (
                      <button
                        className={clsx(['hover:opacity-100 ease duration-200 text-sm'], {
                          'text-red-600 opacity-80 ': !deletePendingEmailClicked,
                          'text-orange-600': deletePendingEmailClicked,
                        })}
                        onClick={() => {
                          if (!deletePendingEmailClicked) {
                            setDeletePendingEmailClicked(true)
                          } else {
                            deletePendingEmailMutate(null)
                          }
                        }}
                      >
                        {deletePendingEmailClicked ? 'Confirm' : 'Cancel'}
                      </button>
                    )}

                    {isDeletePendingEmailLoading && (
                      <button className="text-red-600 opacity-80 hover:opacity-100 ease duration-200">
                        Deleting ...
                      </button>
                    )}
                  </div>
                </div>
              )}

              {updateUserProfileError && (
                <div className="flex flex-col md:flex-row md:items-center xl:w-2/3">
                  <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0 md:ml-[18%]">
                    <Icons.xCircle className="h-4 w-4" />
                    {currentUserErrorMsgFromCode(updateUserProfileError?.code) ??
                      'Something went wrong'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </PersonalSettingsLayout>
      )}
    </>
  )
}

export default ProfileSection
