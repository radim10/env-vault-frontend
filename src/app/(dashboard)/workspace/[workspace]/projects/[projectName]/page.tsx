'use client'
import { useGetProject } from '@/api/queries/projects'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import clsx from 'clsx'
import Link from 'next/link'

// TODO: load project SSR?
//
const dropdownItems = [
  { label: 'Rename', icon: Icons.pencil },
  { label: 'Webhooks', icon: Icons.webhook },
  { label: 'Delete', icon: Icons.trash },
]

export default function ProjectPage({
  params,
}: {
  params: { workspace: string; projectName: string }
}) {
  const {
    data: project,
    isLoading,
    isError,
  } = useGetProject({
    workspaceId: params.workspace,
    projectName: params.projectName,
  })

  if (isLoading) {
    return 'loading'
  }

  if (isError) {
    return 'error'
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Link
              href={`/workspace/${params.workspace}/projects`}
              className="text-primary hover:text-primary hover:underline underline-offset-4"
            >
              <div className="font-semibold text-2xl">Projects</div>
            </Link>
            {/* // */}
            <div className="dark:text-gray-400">
              <Icons.chevronRight className="mt-1" />
            </div>
            <div className="font-semibold text-2xl ">{project.name}</div>
          </div>
          {/* // FLEX END */}
          <div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant={'outline'} size={'icon'}>
                    <Icons.moreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-10 w-[200px] py-1">
                  {dropdownItems.map((item) => (
                    <DropdownMenuItem
                      className={clsx(['flex items-center gap-3 px-4 py-2'], {
                        'text-red-500 dark:hover:text-red-500 hover:text-red-500':
                          item.label === 'Delete',
                      })}
                    >
                      <item.icon className={clsx(['h-4 w-4 opacity-70'])} />
                      <div className="">{item.label}</div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
