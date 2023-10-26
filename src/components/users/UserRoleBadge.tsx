import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { EnvironmentType } from '@/types/environments'
import clsx from 'clsx'

interface Props {
  className?: string
  role: 'admin' | 'member' | 'owner'
}

const UserRoleBadge: React.FC<Props> = ({ className, role }) => {
  return (
    <Badge
      variant="default"
      className={cn(
        clsx(['text-[0.725rem] text-white dark:text-gray-200'], {
          'bg-blue-600 dark:bg-blue-800/80 hover:bg-blue-600 dark:hover:bg-blue-800/80 dark:text-blue-200 text-blue-100':
            role === 'member',
          'bg-green-600 dark:bg-green-800/80 hover:bg-green-600 dark:hover:bg-green-800/80 dark:text-green-200 text-green-100':
            role === 'admin',
          'bg-red-600 dark:bg-red-800/80 hover:bg-red-600 dark:hover:bg-red-800/80 dark:text-red-200 text-red-100':
            role === 'owner',
        }),
        className
      )}
    >
      {role === 'member' && 'Member'}
      {role === 'admin' && 'Admin'}
      {role === 'owner' && 'Owner'}
    </Badge>
  )
}

export default UserRoleBadge
