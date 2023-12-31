'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Props {
  workspaceId: string
}

const items = [
  { label: 'Profile', href: 'profile' },
  { label: 'Access', href: 'access' },
  { label: 'Teams', href: 'teams' },
]

const SingleUserTabs: React.FC<Props> = ({ workspaceId }) => {
  const params = useParams<{ workspace: string; userId: string; tab: string }>()

  return (
    <div className="px-6 lg:px-10 dark:text-gray-400 flex items-center gap-2 md:gap-4 overflow-y-auto text-[1rem] border-b-[1px] pb-0 md:px-3">
      {items.map(({ label, href }, index) => (
        <Link
          href={`/workspace/${workspaceId}/user/${params.userId}/${href}`}
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

export default SingleUserTabs
