'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

interface Props {
  workspaceId: string
  projectName: string
  params: {
    workspace: string
    projectName: string
    projectTab: string
  }
}

const items = [
  { label: 'Environments', href: 'environments' },
  { label: 'Users', href: 'users' },
  { label: 'Settings', href: 'settings' },
]

const ProjectTabs: React.FC<Props> = ({ workspaceId, projectName, params }) => {
  return (
    <div className="px-6 lg:px-10 dark:text-gray-400 flex items-center gap-2 md:gap-4 overflow-y-auto text-[1rem] border-b-[1px] pb-0 md:px-3">
      {items.map(({ label, href }, index) => (
        <Link
          href={`/workspace/${workspaceId}/projects/${projectName}/${href}`}
          className={clsx(
            [
              'border-b-[3px] flex items-center gap-2 h-full hover:dark:text-gray-200 ease duration-150 px-2 lg:px-3 pb-3',
            ],
            {
              'border-primary dark:text-gray-200 font-medium': params?.projectTab === href,
              'border-b-transparent text-gray-700 dark:text-gray-400': params?.projectTab !== href,
            }
          )}
        >
          <div>{label}</div>
        </Link>
      ))}
    </div>
  )
}

export default ProjectTabs
