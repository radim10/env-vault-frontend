'use client'

import { useGetEnvironment } from '@/api/queries/projects/environments/environments'
import Error from '@/components/Error'
import EnvLayoutSkeleton from '@/components/environments/EnvLayoutSkeleton'
import EnvTabs from '@/components/environments/EnvTabs'
import EnvTypeBadge from '@/components/environments/EnvTypeBadge'
import { Icons } from '@/components/icons'
import NotFound from '@/components/projects/NotFound'
import ProjectSkeleton from '@/components/projects/ProjectSkeleton'
import SaveSecretsToolbar from '@/components/secrects/SaveToolbar'
import { Badge } from '@/components/ui/badge'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import { EnvironmentType } from '@/types/environments'
import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useMount, useUnmount, useWindowScroll } from 'react-use'

// TODO: check if env exists
export default function EnvLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string; projectName: string; env: string }
}) {
  const { y } = useWindowScroll()
  const selectedEnvironment = useSelectedEnvironmentStore()
  const paramsData = useParams()

  useMount(() => {})

  useUnmount(() => selectedEnvironment.reset())

  const { isLoading, error } = useGetEnvironment(
    {
      workspaceId: params?.workspace,
      projectName: params?.projectName,
      envName: params?.env,
    },
    {
      onSuccess: (data) => {
        selectedEnvironment.set({
          workspaceId: params?.workspace,
          projectName: params?.projectName,
          //
          name: params?.env,
          type: data?.type,
          locked: data?.locked,
          createdAt: data?.createdAt,
        })
      },
    }
  )

  if (isLoading) {
    return (
      <>
        <EnvLayoutSkeleton isTokens={paramsData?.tab === undefined} />
      </>
    )
  }

  if (error) {
    if (error?.message === 'Project not found') {
      return (
        <NotFound
          link={`/workspace/${params.workspace}/projects`}
          title="Project not found"
          description="Looks like this project doesn't exist"
          btnText="Go to projects"
        />
      )
    } else if (error?.message === 'Environment not found') {
      return (
        <NotFound
          link={`/workspace/${params.workspace}/projects/${params.projectName}`}
          title="Environent not found"
          description="Looks like this environment doesn't exist"
          btnText="Go to project"
        />
      )
    } else {
      return (
        <Error
          link={{
            text: 'Go to projects',
            href: `/workspace/${params?.workspace}/projects`,
          }}
        />
      )
    }
  }

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
        <div className="flex md:flex-row flex-col gap-2 md:items-center ">
          <div className="flex gap-2 items-center">
            <Link
              href={`/workspace/${params?.workspace}/projects/${params?.projectName}`}
              className="text-primary hover:text-primary hover:underline underline-offset-[6px] hover:decoration-2"
            >
              <div className="font-semibold text-2xl">{params?.projectName}</div>
            </Link>
            {/* // */}
            <div className="dark:text-gray-400">
              <Icons.chevronRight className="mt-1" />
            </div>
            <div className="font-semibold text-2xl ">{params?.env}</div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="hidden md:block">
              {selectedEnvironment?.data?.locked && <Icons.lock className="h-4 w-4" />}
            </div>

            <EnvTypeBadge type={selectedEnvironment?.data?.type as EnvironmentType} />

            <div className="block md:hidden">
              {selectedEnvironment?.data?.locked && <Icons.lock className="h-4 w-4" />}
            </div>
          </div>
        </div>

        <div className="md:block flex items-center justify-end">
          <SaveSecretsToolbar />
        </div>
      </div>
      {/**/}
      <div className="mt-5">
        <EnvTabs
          envName={params.env}
          workspaceId={params?.workspace}
          projectName={params?.projectName}
        />
        <div className="mt-4 px-6 lg:px-10">{children}</div>
      </div>
    </>
  )
}
