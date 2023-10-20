'use client'

import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

const items = [
  { label: 'Secrets', href: '' },
  { label: 'Tokens', href: 'tokens' },
  { label: 'Changelog', href: 'changelog' },
  { label: 'Users', href: 'users' },
  { label: 'Settings', href: 'settings' },
]

const EnvTabs: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  const envChagelogFilter = useSelectedEnvironmentStore((state) => state?.changelogFilter)
  const params = useParams<{ workspace: string; projectName: string; env: string; tab?: string }>()

  return (
    <div className="px-6 lg:px-10 dark:text-gray-400 flex items-center gap-2 md:gap-4 overflow-y-auto text-[1rem] border-b-[1px] pb-0 md:px-3">
      {items.map(({ label, href }, index) => (
        <Link
          href={
            label === 'Changelog' && envChagelogFilter === 'secrets'
              ? `/workspace/${workspaceId}/projects/${projectName}/env/${envName}/${href}?only-secrets=true`
              : `/workspace/${workspaceId}/projects/${projectName}/env/${envName}/${href}`
          }
          className={clsx(
            [
              'border-b-[3px] flex items-center gap-2 h-full hover:dark:text-gray-200 ease duration-150 px-2 lg:px-3 pb-3',
            ],
            {
              'border-primary dark:text-gray-200 font-medium':
                params?.tab === label?.toLowerCase() || (index === 0 && !params?.tab),
              'border-b-transparent text-gray-700 dark:text-gray-400':
                params?.tab !== label?.toLowerCase() && !(index === 0 && !params?.tab),
            }
          )}
        >
          <div>{label}</div>
        </Link>
      ))}
    </div>
  )
}

export default EnvTabs
