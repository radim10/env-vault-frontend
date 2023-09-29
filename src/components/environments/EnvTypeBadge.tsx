import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { EnvironmentType } from '@/types/environments'
import clsx from 'clsx'

interface Props {
  className?: string
  type: EnvironmentType
}

const EnvTypeBadge: React.FC<Props> = ({ className, type }) => {
  return (
    <Badge
      variant="default"
      className={cn(
        clsx(['text-[0.725rem] text-white dark:text-gray-200'], {
          'bg-indigo-600 dark:bg-indigo-800/80 hover:bg-indigo-600 dark:hover:bg-indigo-800/80':
            type === EnvironmentType.DEVELOPMENT,
          'bg-blue-600 dark:bg-blue-800/80 hover:bg-blue-600 dark:hover:bg-blue-800/80':
            type === EnvironmentType.TESTING,
          'bg-green-600 dark:bg-green-800/80 hover:bg-green-600 dark:hover:bg-green-800/80':
            type === EnvironmentType.STAGING,
          'bg-red-600 dark:bg-red-800/80 hover:bg-red-600 dark:hover:bg-red-800/80':
            type === EnvironmentType.PRODUCTION,
        }),
        className
      )}
    >
      {type === EnvironmentType.DEVELOPMENT && 'Development'}
      {type === EnvironmentType.TESTING && 'Testing'}
      {type === EnvironmentType.STAGING && 'Staging'}
      {type === EnvironmentType.PRODUCTION && 'Production'}
    </Badge>
  )
}

export default EnvTypeBadge
