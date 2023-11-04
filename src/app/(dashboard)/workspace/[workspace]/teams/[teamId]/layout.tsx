'use client'

import { useGetTeam } from '@/api/queries/teams'
import { Icons } from '@/components/icons'
import NotFound from '@/components/projects/NotFound'
import ProjectSkeleton from '@/components/projects/ProjectSkeleton'
import TeamTabs from '@/components/teams/TeamTabs'
import clsx from 'clsx'
import Error from '@/components/Error'
import Link from 'next/link'
import { useWindowScroll } from 'react-use'
import { useSelectedTeamStore } from '@/stores/selectedTeam'
import { useQueryClient } from '@tanstack/react-query'

export default function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string; teamId: string; tabs: string }
}) {
  const queryClient = useQueryClient()
  const selectedTeam = useSelectedTeamStore()
  const { y } = useWindowScroll()

  const { data, isLoading, error } = useGetTeam(
    {
      workspaceId: params?.workspace,
      teamId: params?.teamId,
    },
    {
      enabled:
        queryClient.getQueryData(['workspace-team', params?.workspace, params?.teamId]) !== null,
      onSuccess: (data) => {
        selectedTeam.set({
          ...data,
          workspaceId: params.workspace,
        })
      },
    }
  )

  if (isLoading) {
    return <ProjectSkeleton />
  }

  if (error) {
    if (error?.code === 'team_not_found') {
      return (
        <NotFound
          link={`/workspace/${params.workspace}/users/teams`}
          title="Team not found"
          description="Looks like this team doesn't exist"
          btnText="Go to teams"
        />
      )
    } else {
      return (
        <Error
          link={{
            text: 'Go to teams',
            href: `/workspace/${params.workspace}/users/teams`,
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
            href={`/workspace/${params.workspace}/users/teams`}
            className="text-primary hover:text-primary hover:underline underline-offset-4 underline-offset-[6px] hover:decoration-2"
          >
            <div className="font-semibold text-2xl">Teams</div>
          </Link>
          {/* // */}
          <div className="dark:text-gray-400">
            <Icons.chevronRight className="mt-1" />
          </div>
          <div className="font-semibold text-2xl ">{selectedTeam?.data?.name}</div>
        </div>
        {/* // FLEX END */}
      </div>
      {selectedTeam?.data?.description && (
        <div className="text-muted-foreground px-6 lg:px-10 line-clamp-1 md:max-w-[50%]">
          {selectedTeam?.data?.description}
        </div>
      )}

      <div className="mt-5">
        <TeamTabs workspaceId={params?.workspace} team={params.teamId} />
        <div className="mt-4 px-6 lg:px-10">{children}</div>
      </div>
    </>
  )
}
