'use client'

import { useGetProjects } from '@/api/queries/projects/root'
import Link from 'next/link'
import React from 'react'
import { Icons } from '../icons'

interface Props {
  // id
  workspace: string
}

const ProjectList: React.FC<Props> = ({ workspace }) => {
  const { data, isLoading } = useGetProjects({
    workspaceId: workspace,
  })

  if (isLoading) {
    return (
      <div className="lg:grid lg:grid-cols-3 gap-4 flex flex-col">
        {Array.from({ length: 6 }).map(() => (
          <div className="h-[8.2rem]  rounded-md border-2 dark:border-gray-800 animate-pulse dark:bg-gray-900" />
        ))}
      </div>
    )
  }
  return (
    <div>
      <div className="lg:grid lg:grid-cols-3 gap-4 flex flex-col">
        {data?.map(({ description, name, environmentCount }) => (
          <Link
            href={`/workspace/${workspace}/projects/${name}`}
            className="cursor-pointer h-[8.2rem] border-2 dark:border-gray-800 transition hover:dark:shadow-xl hover:dark:shadow-primary/20 rounded-md hover:dark:border-primary hover:border-primary hover:scale-[103%] ease duration-200"
          >
            <div className="px-4 py-3 h-full">
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-1">
                  <div className="font-medium dark:text-gray-300 line-clamp-2">{name}</div>
                  <div className="opacity-60 italic text-[0.93rem] line-clamp-2 leading-5">
                    {description && description}
                  </div>
                </div>
                <div className="dark:text-gray-400 dark:border-gray-800  border-[1px] w-fit px-3 py-1 rounded-md">
                  <div className="flex items-center gap-2">
                    <Icons.layer className="h-[0.91rem] w-[0.91rem]" />
                    <span className="text-[0.88rem]">{environmentCount} environments</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProjectList
