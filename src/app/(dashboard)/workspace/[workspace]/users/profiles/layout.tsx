'use client'

import { Icons } from '@/components/icons'
import SingleUserTabs from '@/components/singleUser/SingleUserTabs'
import TypographyH2 from '@/components/typography/TypographyH2'
import UsersTabs from '@/components/users/UsersTabs'
import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { useWindowScroll } from 'react-use'

export default function ProfileLayout({
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
            'px-6 lg:px-10  backdrop-blur-xl flex md:flex-row flex-col justify-between md:items-center gap-0 md:gap-0 -mt-1 sticky top-0 bg-transparent pb-2 pt-2 w-full z-10',
          ],
          {
            'border-b-2': y > 108,
          }
        )}
      >
        <div className="flex gap-2 items-center">
          <Link
            href={`/workspace/${params.workspace}/users/workspace`}
            className="text-primary hover:text-primary hover:underline underline-offset-4 underline-offset-[6px] hover:decoration-2"
          >
            <div className="font-semibold text-2xl">Users</div>
          </Link>
          {/* // */}
          <div className="dark:text-gray-400">
            <Icons.chevronRight className="mt-1" />
          </div>
          <div className="font-semibold text-2xl ">User name</div>
        </div>
        {/* // FLEX END */}
      </div>

      <div className="mt-5">
        <SingleUserTabs workspaceId={params?.workspace} />
        <div className="mt-4 px-6 lg:px-10">{children}</div>
      </div>
    </>
  )
}
