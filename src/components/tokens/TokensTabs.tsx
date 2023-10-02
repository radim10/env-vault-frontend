'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

interface Props {
  workspaceId: string
}

const items = [
  { label: 'Command line', href: 'cli' },
  { label: 'Environments', href: 'environments' },
  { label: 'Workspace', href: 'workspace' },
]

const TokensTabs: React.FC<Props> = ({ workspaceId }) => {
  const params = useParams<{ workspace: string; type: string }>()

  return (
    <div className="px-6 lg:px-10 dark:text-gray-400 flex items-center gap-2 md:gap-4 overflow-y-auto text-[1rem] border-b-[1px] pb-0 md:px-3">
      {items.map(({ label, href }) => (
        <Link
          href={`/workspace/${workspaceId}/tokens/${href}`}
          className={clsx(
            [
              'border-b-[3px] flex items-center gap-2 h-full hover:dark:text-gray-200 ease duration-150 px-2 lg:px-3 pb-3',
            ],
            {
              'border-primary dark:text-gray-200 font-medium': params?.type === href?.toLowerCase(),
              'border-b-transparent text-gray-700 dark:text-gray-400':
                params?.type !== href?.toLowerCase(),
            }
          )}
        >
          <div>{label}</div>
        </Link>
      ))}
    </div>
  )
}

export default TokensTabs
