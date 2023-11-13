import { ProjectRole } from '@/types/projectAccess'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import UserRoleBadge from '../users/UserRoleBadge'
import { WorkspaceUserRole } from '@/types/users'
import { cn } from '@/lib/utils'

interface Props {
  selected: ProjectRole
  className?: string
  disabled?: boolean
  hideLabel?: boolean
  hideDescription?: boolean
  onValueChange: (role: ProjectRole) => void
}

const roles: Array<{ value: ProjectRole; description: string }> = [
  { value: ProjectRole.MEMBER, description: 'Read only access' },
  { value: ProjectRole.ADMIN, description: 'Read/write access to environments' },
  { value: ProjectRole.OWNER, description: 'Full access to project and environments' },
]

const ProjectRoleSelect: React.FC<Props> = ({
  className,
  selected,
  disabled,
  hideLabel,
  hideDescription,
  onValueChange,
}) => {
  return (
    <div className={cn('flex flex-col gap-1 w-full', className)}>
      {hideLabel !== true && (
        <div>
          <Label htmlFor="Role" className="">
            <span className="">Project role</span>
          </Label>
        </div>
      )}

      <Select
        onValueChange={(value) => onValueChange(value as ProjectRole)}
        value={selected}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <>
              <SelectItem
                value={role.value}
                key={role.value}
                className="px-10"
                onFocus={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 md:gap-2.5">
                  <UserRoleBadge role={role?.value as any as WorkspaceUserRole} className="px-4" />
                  {!hideDescription && (
                    <div className="hidden md:block text-sm text-muted-foreground">
                      {role.description}
                    </div>
                  )}
                </div>
              </SelectItem>
            </>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default ProjectRoleSelect
