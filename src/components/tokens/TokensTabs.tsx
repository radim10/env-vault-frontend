'use client'

import useCurrentUserStore from '@/stores/user'
import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'

interface Props {
  workspaceId: string
}

const items = [
  { label: 'Command line', mobileLabel: 'CLI', href: 'cli' },
  { label: 'Environments', href: 'environments' },
  { label: 'Workspace', href: 'workspace' },
]

const TokensTabs: React.FC<Props> = ({ workspaceId }) => {
  const params = useParams<{ workspace: string; type: string }>()
  const { isMemberRole } = useCurrentUserStore()

  return (
    <div className="px-6 lg:px-10 dark:text-gray-400 flex items-center gap-2 md:gap-4 overflow-y-auto text-[1rem] border-b-[1px] pb-0 md:px-3">
      {(isMemberRole() ? items.slice(0, 2) : items).map(({ label, mobileLabel, href }) => (
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
          {!mobileLabel && <div>{label}</div>}
          {mobileLabel && (
            <div>
              <span className="md:hidden">{mobileLabel}</span>
              <span className="hidden md:block">{label}</span>
            </div>
          )}
        </Link>
      ))}
      {isMemberRole() && (
        <>
          <div
            className={clsx(
              [
                'cursor-not-allowed border-b-[3px] flex items-center gap-2 h-full ease duration-150 px-2 lg:px-3 pb-3',
              ],
              {
                'border-primary dark:text-gray-200 font-medium': params?.type === 'workspace',
                'border-b-transparent text-gray-700 dark:text-gray-400 opacity-50':
                  params?.type !== 'workspace',
              }
            )}
          >
            <div>Workspace</div>
          </div>
        </>
      )}
    </div>
  )
}

export default TokensTabs
