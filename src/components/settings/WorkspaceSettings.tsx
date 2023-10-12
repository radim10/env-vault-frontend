'use client'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { LucideIcon } from 'lucide-react'
import { Icons } from '../icons'
import TypographyH4 from '../typography/TypographyH4'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

dayjs.extend(relativeTime)

///

interface Props {
  workspaceId: string
}

const generalItems: Array<{
  label: string
  icon: LucideIcon
}> = [
  {
    icon: Icons.clock4,
    label: 'Created at',
  },
  {
    icon: Icons.user,
    label: 'Super admin',
  },
  {
    icon: Icons.fileText,
    label: 'Name',
  },
]

// TODO: workspace actions based on user role
const WorkspaceSettings: React.FC<Props> = ({}) => {
  return (
    <>
      <div>
        <div className="mt-2 gap-2 rounded-md border-2">
          <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4">
            <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6">
              <TypographyH4>Workspace settings</TypographyH4>
              <Icons.settings2 className="h-5 w-5 opacity-80" />
            </div>
            {/* // */}
            <div className="text-[0.95rem] text-muted-foreground mt-2 md:mt-0 px-3 md:px-6 lg:px-6">
              Modify/edit this workspace
            </div>

            <div className="mt-7 flex flex-col gap-2.5 text-[0.96rem] ox-0">
              {generalItems.map(({ label, icon: Icon }, index) => (
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 text-md md:justify-between px-4 md:px-10 md:h-8">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Icon className="h-4 w-4 opacity-80" />
                      <span className="font-semibold text-[0.96rem]">{label}</span>
                    </div>
                    <div>
                      {label === 'Created at' && <span>{dayjs().format('YYYY-MM-DD HH:mm')}</span>}
                      {label === 'Super admin' && <span>@dimak00 (you)</span>}
                      {label === 'Name' && (
                        <div className="flex justify-between md:justify-start items-center gap-3 md:gap-6">
                          <span>Workspace name</span>
                          <Button size={'sm'} variant={'outline'}>
                            <Icons.pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {index !== generalItems.length - 1 && <Separator />}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      <WorkspaceDangerZone />
    </>
  )
}

const WorkspaceDangerZone: React.FC = () => {
  return (
    <>
      <div className="mt-7 gap-2 rounded-md border-2">
        <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4">
          <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6">
            <TypographyH4 className="text-red-600 dark:text-red-600">Danger zone</TypographyH4>
          </div>

          <div className="mt-4 flex items-center gap-2 text-md justify-between px-3 md:px-8">
            <div className="flex flex-col items-start gap-0 md:gap-0">
              <span className="font-semibold text-[1.01rem]">{`Delete workspace `}</span>
              <span className="text-muted-foreground text-[0.95rem]">
                Permanently delete this workspace, cannot be undone.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Button size={'sm'} variant={'destructive'} className="px-5" disabled={false}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkspaceSettings
