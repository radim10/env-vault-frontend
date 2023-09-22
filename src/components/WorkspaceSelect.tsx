'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Icons } from './icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const WorkspaceSelect = (props: {}) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="h-fit w-full px-3 lg:px-4 py-2 rounded-md border-[1.2px] dark:border-gray-800 dark:text-gray-300 hover:dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <div className=" flex flex-col justify-start">
              <div className="text-[1.1rem] -ml-2">{`Radim's`}</div>
              <div className="text-[0.95rem] opacity-80">Enterprise</div>
            </div>
            <div>
              <Icons.chevronDown className="h-5 w-5 opacity-80" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-md w-[220px]">
          <DropdownMenuItem>Workspace 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default WorkspaceSelect
