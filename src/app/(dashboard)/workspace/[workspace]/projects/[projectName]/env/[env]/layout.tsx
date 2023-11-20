'use client'

import { useGetEnvironment } from '@/api/queries/projects/environments/environments'
import Error from '@/components/Error'
import EnvLayoutSkeleton from '@/components/environments/EnvLayoutSkeleton'
import EnvTabs from '@/components/environments/EnvTabs'
import EnvTypeBadge from '@/components/environments/EnvTypeBadge'
import { Icons } from '@/components/icons'
import NotFound from '@/components/projects/NotFound'
import ProjectRoleBadge from '@/components/projects/ProjectRoleBadge'
import SaveSecretsToolbar from '@/components/secrects/SaveToolbar'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import { useSelectedProjectStore } from '@/stores/selectedProject'
import { EnvironmentType } from '@/types/environments'
import { ProjectRole } from '@/types/projectAccess'
import { useQueryClient } from '@tanstack/react-query'
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
  const { data: selectedProject } = useSelectedProjectStore()

  const queryClient = useQueryClient()
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
      returnProjectRole: !selectedProject,
    },
    {
      enabled:
        queryClient.getQueryData([params?.workspace, params?.projectName, params?.env]) !== null,
      onSuccess: (data) => {
        const projectRole = (selectedProject?.userRole ?? data?.userRole) as ProjectRole

        selectedEnvironment.set({
          workspaceId: params?.workspace,
          projectName: params?.projectName,
          createdBy: data?.createdBy,
          //
          name: params?.env,
          type: data?.type,
          locked: data?.locked,
          createdAt: data?.createdAt,
          userRole: projectRole,
        })
      },
    }
  )

  if (isLoading || !selectedEnvironment?.data) {
    return (
      <>
        <EnvLayoutSkeleton isSecrets={paramsData?.tab === undefined} />
      </>
    )
  }

  if (error) {
    if (error?.code === 'project_not_found') {
      return (
        <NotFound
          link={`/workspace/${params.workspace}/projects`}
          title="Project not found"
          description="Looks like this project doesn't exist"
          btnText="Go to projects"
        />
      )
    } else if (error?.code === 'environment_not_found') {
      return (
        <NotFound
          link={`/workspace/${params.workspace}/projects/${params.projectName}`}
          title="Environent not found"
          description="Looks like this environment doesn't exist"
          btnText="Go to projects"
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
        <div className="flex md:flex-row flex-col md:gap-2 md:items-center ">
          <div className="flex md:gap-2 items-center flex-wrap">
            <Link
              href={`/workspace/${params?.workspace}/projects/${params?.projectName}/environments`}
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

          <div className="mt-2 md:mt-0 flex gap-3 items-center">
            <div className="hidden md:block">
              {selectedEnvironment?.data?.locked && <Icons.lock className="h-4 w-4" />}
            </div>

            <EnvTypeBadge type={selectedEnvironment?.data?.type} />

            <div className="hidden md:flex items-center gap-3">
              <div className="h-6 w-[1px] dark:bg-gray-800 bg-gray-300" />
              <ProjectRoleBadge role={selectedEnvironment?.data?.userRole} envToolbar tooltip />
            </div>

            {selectedEnvironment?.data?.locked && (
              <div className="block md:hidden">
                <Icons.lock className="h-4 w-4" />
              </div>
            )}

            <div className="flex md:hidden items-center gap-3">
              <div className="h-6 w-[1px] dark:bg-gray-800 bg-gray-300" />
              <ProjectRoleBadge role={selectedEnvironment?.data?.userRole} envToolbar />
            </div>
          </div>
        </div>

        {selectedEnvironment?.isViewerRole() !== true && !paramsData?.tab && (
          <div className="md:block flex items-center justify-end mt-3 md:mt-0">
            <SaveSecretsToolbar showBtn={!paramsData?.tab} />
          </div>
        )}
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
