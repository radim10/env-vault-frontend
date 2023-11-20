import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import clsx from 'clsx'
import { ProjectRole } from '@/types/projectAccess'
import { Icons } from '../icons'

interface Props {
  className?: string
  role: ProjectRole
}

const ProjectRoleBadge: React.FC<Props> = ({ className, role }) => {
  return (
    <Badge
      variant="default"
      className={cn(
        clsx(['text-[0.725rem] text-white dark:text-gray-200 pl-2'], {
          'bg-blue-600 dark:bg-blue-800/80 hover:bg-blue-600 dark:hover:bg-blue-800/80 dark:text-blue-200 text-blue-100':
            role === ProjectRole.VIEWER,
          'bg-green-600 dark:bg-green-800/80 hover:bg-green-600 dark:hover:bg-green-800/80 dark:text-green-200 text-green-100':
            role === ProjectRole.EDITOR,
          'bg-red-600 dark:bg-red-800/80 hover:bg-red-600 dark:hover:bg-red-800/80 dark:text-red-200 text-red-100':
            role === ProjectRole.ADMIN,
        }),
        className
      )}
    >
      {role === ProjectRole.VIEWER && (
        <div className="flex items-center gap-1.5">
          <Icons.eye className="w-3.5 h-3.5" />
          <span>VIEWER</span>
        </div>
      )}
      {role === ProjectRole.EDITOR && (
        <div className="flex items-center gap-1.5">
          <Icons.penLine className="w-3.5 h-3.5" />
          <span>Editor</span>
        </div>
      )}
      {role === ProjectRole.ADMIN && (
        <div className="flex items-center gap-1.5">
          <Icons.settings2 className="w-3.5 h-3.5" />
          <span>Admin</span>
        </div>
      )}
    </Badge>
  )
}

export default ProjectRoleBadge
