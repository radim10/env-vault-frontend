import React from 'react'
import CreateEnvironmentDialog from './CreateEnvironmentDialog'
import { EnvironmentType } from '@/types/environments'
import { useWindowScroll } from 'react-use'
import clsx from 'clsx'

interface Props {
  workspaceId: string
  projectName: string
  //
  environmentsCount: number
  onCreated: (args: { name: string; type: EnvironmentType }) => void
}

const EnvironmentListToolbar: React.FC<Props> = ({
  workspaceId,
  projectName,
  environmentsCount,
  onCreated,
}) => {
  const { y } = useWindowScroll()

  return (
    <div
      className={clsx(['flex flex-col md:flex-row justify-between md:items-center sticky top-0 bg-background z-50 pb-2 pt-3' ], {
        'border-b-2': y > 160,
      })}
    >
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
