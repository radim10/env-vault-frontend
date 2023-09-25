import React from 'react'
import clsx from 'clsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Icons } from '../icons'
import { Button } from '../ui/button'

interface Props {
  onCopy: (type: 'env' | 'json') => void
  onRename: () => void
  onDelete: () => void
}

const dropdownActionItems = [
  { label: 'Rename', icon: Icons.pencil },
  { label: 'Delete', icon: Icons.trash },
]

// TODO:
const dropdownActionSecretsItems = [
  { label: 'Copy secrets (.env)', icon: Icons.fileText },
  { label: 'Copy secrets (json)', icon: Icons.fileJson },
]

const EnvActionsDropdown: React.FC<Props> = ({ onCopy, onRename, onDelete }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={'outline'} size={'sm'}>
            <Icons.moreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-10 w-[200px] mt-1">
          {dropdownActionSecretsItems.map((item, index) => (
            <DropdownMenuItem
              onClick={() => {
                if (index === 0) {
                  onCopy('env')
                } else {
                  onCopy('json')
                }
              }}
              className={clsx(['flex items-center gap-3 px-3.5 py-2'], {})}
            >
              <item.icon className={clsx(['h-4 w-4 opacity-70'])} />
              <div className="">{item.label}</div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {dropdownActionItems.map((item) => (
              <DropdownMenuItem
                onClick={() => {
                  if (item.label === 'Rename') {
                    onRename()
                  } else if (item.label === 'Delete') {
                    onDelete()
                  }
                }}
                className={clsx(['flex items-center gap-3 px-3.5 py-2'], {
                  'text-red-500 dark:hover:text-red-500 hover:text-red-500':
                    item.label === 'Delete',
                })}
              >
                <item.icon className={clsx(['h-4 w-4 opacity-70'])} />
                <div className="">{item.label}</div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default EnvActionsDropdown
