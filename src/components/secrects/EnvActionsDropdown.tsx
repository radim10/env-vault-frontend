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

const dropdownActionItemsUnlocked = [
  { label: 'Rename', icon: Icons.pencil },
  { label: 'Change type', icon: Icons.penSquare },
  { label: 'Lock', icon: Icons.lock },
  { label: 'Delete', icon: Icons.trash },
]

const dropdownActionItemsLocked = [{ label: 'Unlock', icon: Icons.unlock }]

const dropdownActionSecretsItems = [
  { label: 'Copy secrets (.env)', icon: Icons.fileText },
  { label: 'Copy secrets (json)', icon: Icons.fileJson },
]

interface Props {
  isLocked: boolean
  hideCopySecrets: boolean
  onCopy: (type: 'env' | 'json') => void
  onRename: () => void
  onDelete: () => void
  onLock: () => void
  onChangeType: () => void
}

const EnvActionsDropdown: React.FC<Props> = ({
  hideCopySecrets,
  isLocked,
  onCopy,
  onRename,
  onDelete,
  onLock,
  onChangeType,
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant={'outline'} size={'sm'}>
            <Icons.moreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-10 w-[200px] mt-1">
          {!hideCopySecrets && (
            <>
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
            </>
          )}
          <DropdownMenuGroup>
            {(isLocked ? dropdownActionItemsLocked : dropdownActionItemsUnlocked).map((item) => (
              <DropdownMenuItem
                onClick={() => {
                  if (item.label === 'Rename') {
                    onRename()
                  } else if (item.label === 'Delete') {
                    onDelete()
                  } else if (item.label === 'Lock' || item.label === 'Unlock') {
                    onLock()
                  } else if (item.label === 'Change type') {
                    onChangeType()
                  }
                }}
                className={clsx(['flex items-center gap-3 px-3.5 py-2'], {
                  'dark:text-red-500 dark:hover:text-red-500 text-red-600 hover:text-red-600':
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
