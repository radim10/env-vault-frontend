'use client'
import { useGetProject } from '@/api/queries/projects'
import { Icons } from '@/components/icons'
import Link from 'next/link'

// TODO: load project SSR?

export default function ProjectPage({
  params,
}: {
  params: { workspace: string; projectName: string }
}) {
  const {
    data: project,
    isLoading,
    isError,
  } = useGetProject({
    workspaceId: params.workspace,
    projectName: params.projectName,
  })

  if (isLoading) {
    return 'loading'
  }

  if (isError) {
    return 'error'
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Link
              href={`/workspace/${params.workspace}/projects`}
              className="text-primary hover:text-primary hover:underline underline-offset-4"
            >
              <div className="font-semibold text-2xl">Projects</div>
            </Link>
            {/* // */}
            <div className="dark:text-gray-400">
              <Icons.chevronRight className="mt-1" />
            </div>
            <div className="font-semibold text-2xl ">{project.name}</div>
          </div>
        </div>
      </div>
    </>
  )
}
