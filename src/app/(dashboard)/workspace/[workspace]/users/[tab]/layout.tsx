'use client'

import TypographyH2 from '@/components/typography/TypographyH2'
import UsersTabs from '@/components/users/UsersTabs'
import clsx from 'clsx'
import React from 'react'
import { useWindowScroll } from 'react-use'

export default function UsersLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string; projectName: string; env: string }
}) {
  const { y } = useWindowScroll()

  return (
    <>
      <div
        className={clsx(
          [
            'px-6 lg:px-10  backdrop-blur-xl flex md:flex-row flex-col justify-between md:items-center gap-0 md:gap-0 -mt-2 sticky top-0 bg-transparent pb-2 pt-3 w-full z-10',
          ],
          {
            'border-b-2': y > 104,
          }
        )}
      >
        <div className="flex md:flex-col flex-col gap-2 md:items-start ">
          <TypographyH2>Users</TypographyH2>
        </div>
        {/* // */}
      </div>
      <div className="text-muted-foreground px-6 lg:px-10">Manage your workspace users</div>
      <div className="mt-5">
        <UsersTabs workspaceId={params?.workspace} />

        <div className="mt-4 px-6 lg:px-10">{children}</div>
      </div>
    </>
  )
}
