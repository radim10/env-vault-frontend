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
import clsx from 'clsx'
import { useToast } from '../ui/use-toast'
import { currentUserErrorMsgFromCode } from '@/api/requests/currentUser'

const UserProfileSettings = () => {
  const { toast } = useToast()
  const { data: currentUser, update: updateCurrentUser } = useCurrentUserStore()

  const [editActive, setEditActive] = useState(false)
  const [newName, setNewName] = useState('')

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

  return (
    <>
      <div className="flex flex-col gap-7 mt-6">
        <PersonalSettingsLayout icon={Icons.userCircle} title="Profile">
          <div className="flex flex-col">
            <div className="flex flex-col gap-4 justify-center w-full">
              {/* // */}
              <div className="flex flex-row gap-5 md:gap-2 items-center xl:w-2/3">
                <div className="md:w-[18%]">
                  <Label>Avatar</Label>
                </div>
                <Avatar className="w-12 h-12 border-[1.5px]">
                  <AvatarImage src={currentUser?.avatarUrl ?? ''} />
                  <AvatarFallback>{currentUser?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                <div className="md:w-[20%]">
                  <Label>Full name</Label>
                </div>
                <Input
                  disabled={isLoading}
                  readOnly={!editActive}
                  value={!editActive ? currentUser?.name : newName}
                  onChange={(e) => {
                    if (!editActive) return
                    setNewName(e.target.value)
                  }}
                />
                {/* <Button onClick={() => {}} variant="outline" className="ml-auto"> */}
                {/*   <Icons.penSquare className="h-4 w-4 opacity-80" /> */}
                {/* </Button> */}
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                <div className="md:w-[20%]">
                  <Label>Email</Label>
                </div>
                <Input value={currentUser?.email} disabled={editActive} />
              </div>

              {updateUserProfileError && (
                <div className="flex flex-col md:flex-row md:items-center xl:w-2/3">
                  <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0 md:ml-[18%]">
                    <Icons.xCircle className="h-4 w-4" />
                    {currentUserErrorMsgFromCode(updateUserProfileError?.code) ??
                      'Something went wrong'}
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-2 items-center xl:w-2/3">
                <div className="gap-3 flex flex-row items-center justify-end w-full">
                  <Button
                    onClick={() => handleToggleEdit(!editActive)}
                    variant="outline"
                    className="ml-auto gap-3"
                  >
                    {!editActive && <Icons.penSquare className="h-4 w-4 opacity-80" />}
                    {editActive ? 'Cancel' : 'Edit'}
                  </Button>
                  {editActive && (
                    <Button
                      disabled={!newName || newName === currentUser?.name || isLoading}
                      onClick={() =>
                        updateUserProfile({
                          name: newName,
                        })
                      }
                      variant="default"
                      className={clsx({
                        'gap-3': true,
                      })}
                      loading={false}
                    >
                      {!isLoading && <Icons.save className="h-4 w-4" />}
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </PersonalSettingsLayout>
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

export default UserProfileSettings
