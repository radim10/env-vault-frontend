'use client'

import { useGetProject } from '@/api/queries/projects/root'
import { useQueryClient } from '@tanstack/react-query'
import ProjectTabs from '@/components/projects/ProjectTabs'
import { Icons } from '@/components/icons'
import Link from 'next/link'
import NotFound from '@/components/projects/NotFound'
import Error from '@/components/Error'
import { useParams } from 'next/navigation'
import ProjectSkeleton from '@/components/projects/ProjectSkeleton'

function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { workspace: string; projectName: string }
}) {
  const queryClient = useQueryClient()
  const paramValues = useParams<{
    workspace: string
    projectName: string
    projectTab: string
  }>()

  const {
    data: project,
    isLoading,
    error,
  } = useGetProject(
    {
      workspaceId: params?.workspace,
      projectName: params?.projectName,
    },
    {
      enabled:
        queryClient.getQueryData(['project', params?.workspace, params?.projectName]) !== null,
    }
  )
  if (isLoading) {
    return <ProjectSkeleton />
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
    } else {
      return (
        <Error
          link={{
            text: 'Go to projects',
            href: `/workspace/${params.workspace}/projects`,
          }}
        />
      )
    }
  }

  if (project === null) {
    return 'Project deleted'
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center px-6 lg:px-10 mt-1 pb-2">
          <div className="flex gap-2 items-center">
            <Link
              href={`/workspace/${params.workspace}/projects`}
              className="text-primary hover:text-primary hover:underline underline-offset-4 underline-offset-[6px] hover:decoration-2"
            >
              <div className="font-semibold text-2xl">Projects</div>
            </Link>
            {/* // */}
            <div className="dark:text-gray-400">
              <Icons.chevronRight className="mt-1" />
            </div>
            <div className="font-semibold text-2xl ">{project.name}</div>
          </div>
          {/* // FLEX END */}
        </div>
      </div>

      {project.description && (
        <div className="text-muted-foreground px-6 lg:px-10 line-clamp-1 md:max-w-[50%]">
          {project.description}
        </div>
      )}

      <div className="mt-5">
        <ProjectTabs
          workspaceId={params.workspace}
          projectName={params.projectName}
          params={paramValues}
        />
        <div className="">{children}</div>
      </div>
    </>
  )
}

export default ProjectLayout
