'use client'

import { useGetProjects } from '@/api/queries/projects'
import Link from 'next/link'
import React from 'react'

interface Props {
  // id
  workspace: string
}

const ProjectList: React.FC<Props> = ({ workspace }) => {
  const { data, isLoading } = useGetProjects({
    workspaceId: workspace,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <div className="grid  grid-cols-3 gap-4">
        {data?.map(({ id, description, name }) => (
          <Link
            key={id}
            href={`/workspace/${workspace}/projects/${name}`}
            className="cursor-pointer h-28 border-2 dark:border-gray-800 transition hover:dark:shadow-xl hover:dark:shadow-primary/20 rounded-md hover:dark:border-primary hover:border-primary hover:scale-[103%] ease duration-200"
          >
            <div className="px-4 py-3 ">
              <div className="font-medium">{name}</div>
              <div className="opacity-60 italic">{description && description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProjectList
