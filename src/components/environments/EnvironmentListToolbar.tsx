import React from 'react'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import CreateEnvironmentDialog from './CreateEnvironmentDialog'

interface Props {
  workspaceId: string
  projectName: string
  //
  environmentsCount: number
  onCreated: (name: string) => void
}

const EnvironmentListToolbar: React.FC<Props> = ({
  workspaceId,
  projectName,
  environmentsCount,
  onCreated,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center">
      <div className="pl-1 dark:text-gray-400 font-bold">
        <span>Total environments: {environmentsCount}</span>
      </div>

      <div>
        <CreateEnvironmentDialog
          workspaceId={workspaceId}
          projectName={projectName}
          onSuccess={onCreated}
        />
      </div>
    </div>
  )
}

export default EnvironmentListToolbar
