'use client'

import { Icons } from './icons'
import Link from 'next/link'
import { Button } from './ui/button'

interface Props {
  workspaceId: string
  showLink?: boolean
  text?: string
}

const FeatureLock: React.FC<Props> = ({ workspaceId, showLink, text }) => {
  return (
    <div className="h-72 xl:h-80 flex flex-col items-center justify-center gap-2 rounded-md bg-gray-50 dark:bg-gray-900">
      <Icons.lock className="w-14 h-14 opacity-30" />
      <div className="text-md">{text ?? 'Teams are available only for paid plans'}</div>
      {showLink && (
        <Link href={`/workspace/${workspaceId}/settings/subscription`}>
          <Button size={'sm'} className="mt-2 px-6">
            Upgrade
          </Button>
        </Link>
      )}
    </div>
  )
}

export default FeatureLock
