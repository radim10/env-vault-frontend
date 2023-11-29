'use client'

import { useState } from 'react'
import TypographyH4 from '../typography/TypographyH4'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Icons } from '../icons'
import DangerZone from '../DangerZone'
import { Button } from '@/components/ui/button'
import { Separator } from '../ui/separator'
import WorkspacePreferences from './WorkspacePreferences'

const UserProfileSettings = (props: {}) => {
  const [editActive, setEditActive] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-7 mt-6">
        <div className="rounded-md w-full border-2 px-3 py-3 md:px-5 md:py-4 md:pb-6">
          <div className="gap-3 flex items-center">
            <TypographyH4>Proflie</TypographyH4>
            <Icons.userCircle className="h-5 w-5 opacity-80" />
          </div>
          <Separator className="mt-3" />

          <div className="flex flex-col mt-5 px-3">
            <div className="flex flex-col gap-4 justify-center w-full">
              {/* // */}
              <div className="flex flex-row gap-5 md:gap-2 items-center xl:w-2/3">
                <div className="md:w-[15%]">
                  <Label>Avatar</Label>
                </div>
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                <div className="md:w-[15%]">
                  <Label>Full name</Label>
                </div>
                <Input value={'Radim Hofer'} readOnly={!editActive} />
                {/* <Button onClick={() => {}} variant="outline" className="ml-auto"> */}
                {/*   <Icons.penSquare className="h-4 w-4 opacity-80" /> */}
                {/* </Button> */}
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
                <div className="md:w-[15%]">
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
        </div>
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
