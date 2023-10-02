import React from 'react'
import TypographyH4 from '../typography/TypographyH4'
import { Button } from '../ui/button'
import { Icons } from '../icons'

interface Props {
  workspaceId: string
}

const WorkspaceTokens: React.FC<Props> = ({ workspaceId }) => {
  return (
    <div>
      <div className="mt-2 gap-2 rounded-md border-2">
        <div className="px-3 py-3 md:px-5 md:py-4">
          <div className="flex items-center justify-between">
            <TypographyH4>Workspace tokens (SDKs)</TypographyH4>

            <Button variant={'outline'} size={'sm'} className="gap-2 hidden md:flex">
              <Icons.plus className="h-4 w-4" />
              Add new
            </Button>
          </div>
          {/* // */}
          <div className="text-[0.95rem] text-muted-foreground mt-2">
            Workspace tokens are used with SDKs to access selected projects in the workspace and all
            content in those projects (environments, secrets).
          </div>
        </div>
        // TABLE
      </div>
    </div>
  )
}

export default WorkspaceTokens
