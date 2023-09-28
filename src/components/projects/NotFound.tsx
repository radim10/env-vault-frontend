import React from 'react'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import Link from 'next/link'

interface Props {
  workspaceId: string
}

const NotFound: React.FC<Props> = ({ workspaceId }) => {
  return (
    <div>
      <div className="flex items-center justify-center mt-36">
        <div className="flex flex-col items-center gap-2">
          <div>
            <Icons.xCircle className="h-20 w-20 opacity-30" />
          </div>
          <div className="text-center">
            <span className="text-lg font-bold opacity-85">Project not found</span>
            <div className="my-1">Looks like this project doesn't exist</div>
            <div className="mt-5">
              <Link href={`/workspace/${workspaceId}/projects`}>
                <Button>Go to projects</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
