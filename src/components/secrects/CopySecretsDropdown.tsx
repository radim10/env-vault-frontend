import React from 'react'
import clsx from 'clsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Icons } from '../icons'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const dropdownActions = [
  { label: 'Copy secrets (.env)', icon: Icons.fileText },
  { label: 'Copy secrets (json)', icon: Icons.fileJson },
]

interface Props {
  btn?: {
    loading?: boolean
    variant?: 'ghost' | 'default'
    size?: 'sm' | 'default'
    className?: string
  }
  dropdownClassName?: string
  onCopy: (type: 'dotenv' | 'json') => void
}

const CopySecretsDropdown: React.FC<Props> = ({ onCopy, btn, dropdownClassName }) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant={btn?.variant ?? 'outline'}
            size={btn?.size ?? 'default'}
            className={cn(btn?.className)}
            loading={btn?.loading}
          >
            {!btn?.loading && <Icons.copy className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn(dropdownClassName, 'mr-0 w-[200px] mt-1')}>
          <>
            {dropdownActions.map((item, index) => (
              <DropdownMenuItem
                onClick={() => {
                  if (index === 0) {
                    onCopy('dotenv')
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
          </>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CopySecretsDropdown
