import React from 'react'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import CreateEnvironmentDialog from './CreateEnvironmentDialog'

interface Props {
  environmentsCount: number
}

const EnvironmentListToolbar: React.FC<Props> = ({ environmentsCount }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center">
      <div className="pl-1 dark:text-gray-400 font-bold">
        <span>Total environments: {environmentsCount}</span>
      </div>

      <div>
        <CreateEnvironmentDialog />
      </div>
    </div>
  )
}

export default EnvironmentListToolbar
