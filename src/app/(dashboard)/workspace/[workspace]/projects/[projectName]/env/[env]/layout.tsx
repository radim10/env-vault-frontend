'use client'

import { useGetEnvironment } from '@/api/queries/projects/environments/environments'
import EnvLayoutSkeleton from '@/components/environments/EnvLayoutSkeleton'
import EnvTabs from '@/components/environments/EnvTabs'
import { Icons } from '@/components/icons'
import NotFound from '@/components/projects/NotFound'
import ProjectSkeleton from '@/components/projects/ProjectSkeleton'
import SaveSecretsToolbar from '@/components/secrects/SaveToolbar'
import { Badge } from '@/components/ui/badge'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import { EnvironmentType } from '@/types/environments'
import clsx from 'clsx'
import Link from 'next/link'
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
        <EnvLayoutSkeleton />
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
      return 'error'
    }
  }

  return (
    <>
      <div
        className={clsx(
          [
            'flex md:flex-row flex-col justify-between md:items-center gap-2 md:gap-0 -mt-2 sticky top-0 bg-background pb-2 pt-3 w-full z-10',
          ],
          {
            'border-b-2': y > 120,
          }
        )}
      >
        <div className="hidden md:flex gap-2 items-center">
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

          <div className="flex gap-3 items-center">
            <div>{selectedEnvironment?.data?.locked && <Icons.lock className="h-4 w-4" />}</div>

            <Badge
              variant="default"
              className={clsx(['text-[0.725rem] text-gray-200'], {
                'bg-indigo-600 dark:bg-indigo-800/80 hover:bg-indigo-600 dark:hover:bg-indigo-800/80':
                  selectedEnvironment?.data?.type === EnvironmentType.DEVELOPMENT,
                'bg-blue-600 dark:bg-blue-800/80 hover:bg-blue-600 dark:hover:bg-blue-800/80':
                  selectedEnvironment?.data?.type === EnvironmentType.TESTING,
                'bg-green-600 dark:bg-green-800/80 hover:bg-green-600 dark:hover:bg-green-800/80':
                  selectedEnvironment?.data?.type === EnvironmentType.STAGING,
                'bg-red-600 dark:bg-red-800/80 hover:bg-red-600 dark:hover:bg-red-800/80':
                  selectedEnvironment?.data?.type === EnvironmentType.PRODUCTION,
              })}
            >
              {selectedEnvironment?.data?.type === EnvironmentType.DEVELOPMENT && 'Development'}
              {selectedEnvironment?.data?.type === EnvironmentType.TESTING && 'Testing'}
              {selectedEnvironment?.data?.type === EnvironmentType.STAGING && 'Staging'}
              {selectedEnvironment?.data?.type === EnvironmentType.PRODUCTION && 'Production'}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-start md:hidden">
          <Link
            href={`/workspace/${params?.workspace}/projects/${params?.projectName}`}
            className="text-primary hover:text-primary hover:underline underline-offset-[6px] hover:decoration-2"
          >
            <div className="font-semibold text-2xl">{params?.projectName}</div>
          </Link>
          {/* // */}

          <div className="font-semibold text-xl ">{params?.env}</div>

          <div
            className={clsx(['flex items-center'], {
              'gap-3': selectedEnvironment?.data?.locked,
            })}
          >
            <div>{selectedEnvironment?.data?.locked && <Icons.lock className="h-4 w-4" />}</div>

            <Badge
              variant="default"
              className={clsx(['text-[0.725rem] text-gray-200'], {
                'bg-indigo-600 dark:bg-indigo-800/80 hover:bg-indigo-600 dark:hover:bg-indigo-800/80':
                  selectedEnvironment?.data?.type === EnvironmentType.DEVELOPMENT,
                'bg-blue-600 dark:bg-blue-800/80 hover:bg-blue-600 dark:hover:bg-blue-800/80':
                  selectedEnvironment?.data?.type === EnvironmentType.TESTING,
                'bg-green-600 dark:bg-green-800/80 hover:bg-green-600 dark:hover:bg-green-800/80':
                  selectedEnvironment?.data?.type === EnvironmentType.STAGING,
                'bg-red-600 dark:bg-red-800/80 hover:bg-red-600 dark:hover:bg-red-800/80':
                  selectedEnvironment?.data?.type === EnvironmentType.PRODUCTION,
              })}
            >
              {selectedEnvironment?.data?.type === EnvironmentType.DEVELOPMENT && 'Development'}
              {selectedEnvironment?.data?.type === EnvironmentType.TESTING && 'Testing'}
              {selectedEnvironment?.data?.type === EnvironmentType.STAGING && 'Staging'}
              {selectedEnvironment?.data?.type === EnvironmentType.PRODUCTION && 'Production'}
            </Badge>
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
        <div className="mt-4">{children}</div>
      </div>
    </>
  )
}
