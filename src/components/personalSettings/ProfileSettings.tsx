'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Icons } from '../icons'
import DangerZone from '../DangerZone'
import { Button } from '@/components/ui/button'
import WorkspacePreferences from './WorkspacePreferences'
import PersonalSettingsLayout from './Layout'

const UserProfileSettings = () => {
  const [editActive, setEditActive] = useState(false)

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
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                <div className="md:w-[20%]">
                  <Label>Full name</Label>
                </div>
                <Input value={'Radim Hofer'} readOnly={!editActive} />
                {/* <Button onClick={() => {}} variant="outline" className="ml-auto"> */}
                {/*   <Icons.penSquare className="h-4 w-4 opacity-80" /> */}
                {/* </Button> */}
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                <div className="md:w-[20%]">
                  <Label>Email</Label>
                </div>
                <Input value={'radimhofer@me.com'} readOnly={!editActive} />
              </div>

              <div className="flex flex-col md:flex-row gap-2 items-center xl:w-2/3">
                <Button onClick={() => {}} variant="outline" className="ml-auto gap-3">
                  <Icons.penSquare className="h-4 w-4 opacity-80" />
                  Edit
                </Button>
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
