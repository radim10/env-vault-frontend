'use client'

import { useGetProjects } from '@/api/queries/projects/root'
import Link from 'next/link'
import React from 'react'
import { Icons } from '../icons'
import Error from '../Error'
import { ListProject, ProjectSort } from '@/types/projects'

interface Props {
  // id
  workspace: string
  sort: ProjectSort
}

const ProjectList: React.FC<Props> = ({ workspace, sort }) => {
  const sortProjects = (data: ListProject[]): ListProject[] => {
    let sorted: ListProject[] = []

    if (sort === ProjectSort.CreatedDesc) {
      sorted = data.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()

        if (dateA > dateB) {
          return -1
        } else if (dateA < dateB) {
          return 1
        } else {
          return 0
        }
      })
    } else if (sort === ProjectSort.CreatedAsc) {
      sorted = data.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()

        if (dateA < dateB) {
          return -1
        } else if (dateA > dateB) {
          return 1
        } else {
          return 0
        }
      })
    } else if (sort === ProjectSort.AlphabeticalAsc) {
      sorted = data.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()

        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    } else if (sort === ProjectSort.AlphabeticalDesc) {
      sorted = data.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()

        if (nameA > nameB) {
          return -1
        }
        if (nameA < nameB) {
          return 1
        }
        return 0
      })
    } else if (sort === ProjectSort.EnvCountDesc) {
      sorted = data.sort((a, b) => {
        return b.environmentCount - a.environmentCount
      })
    } else if (sort === ProjectSort.EnvCountAsc) {
      sorted = data.sort((a, b) => {
        return a.environmentCount - b.environmentCount
      })
    }

    return sorted
  }

  const { data, isLoading, error } = useGetProjects(
    {
      workspaceId: workspace,
    },
    {
      select: sortProjects,
    }
  )

  if (isLoading) {
    return (
      <div className="lg:grid lg:grid-cols-3 gap-4 flex flex-col">
        {Array.from({ length: 6 }).map(() => (
          <div className="h-[8.2rem]  rounded-md border-2 dark:border-gray-800 animate-pulse dark:bg-gray-900" />
        ))}
      </div>
    )
  }

  if (error) {
    return <Error />
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
                    <span className="text-[0.88rem]">
                      {environmentCount === 0 ? 'No' : environmentCount} environments
                    </span>
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
