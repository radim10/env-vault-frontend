'use client'

import { useGetWorkspaceUser } from '@/api/queries/users'
import { Icons } from '@/components/icons'
import ProjectSkeleton from '@/components/projects/ProjectSkeleton'
import SingleUserTabs from '@/components/singleUser/SingleUserTabs'
import NotFound from '@/components/projects/NotFound'
import Error from '@/components/Error'
import clsx from 'clsx'
import Link from 'next/link'
import { useWindowScroll } from 'react-use'
import { useSelectedUserStore } from '@/stores/selectedUser'

export default function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string; userId: string }
}) {
  const { y } = useWindowScroll()
  const { set: setSelectedUser } = useSelectedUserStore()

  const { data, isLoading, error } = useGetWorkspaceUser(
    {
      userId: params?.userId,
      workspaceId: params?.workspace,
    },
    {
      onSuccess: (data) => setSelectedUser(data),
    }
  )

  if (isLoading) {
    return <ProjectSkeleton />
  }

  if (error) {
    if (error?.code === 'user_not_found') {
      return (
        <NotFound
          link={`/workspace/${params.workspace}/users`}
          title="Team not found"
          description="Looks like this user doesn't exist"
          btnText="Go to teams"
        />
      )
    } else {
      return (
        <Error
          link={{
            text: 'Go to users',
            href: `/workspace/${params.workspace}/users`,
          }}
        />
      )
    }
  }

  if (data === null) {
    return 'Project deleted'
  }

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
          <div className="font-semibold text-2xl ">{data.name}</div>
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
