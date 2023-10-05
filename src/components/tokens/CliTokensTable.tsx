import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import dayjs from 'dayjs'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import relativeTime from 'dayjs/plugin/relativeTime'
import { CliToken } from '@/types/tokens/cli'
import { Icons } from '../icons'

dayjs.extend(relativeTime)

interface Props {
  data: CliToken[]
  onCopyToken: (token: string) => void
  onRevoke: (id: string) => void
}

const CliTokensTable: React.FC<Props> = ({ data, onCopyToken, onRevoke }) => {
  return (
    <div>
      <Table>
        {data?.length === 5 && (
          <TableCaption className="mt-4 mb-7">Showing 5 latest tokens</TableCaption>
        )}
        <TableHeader className="bg-gray-100/60 hover:bg-gray-100/60 dark:bg-gray-900/80 hover:dark:bg-gray-900/80 sticky">
          <TableRow className="">
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[120px]">Token</TableHead>
            <TableHead className="w-">Created at</TableHead>
            <TableHead className="w-">Last used at</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, name, value, createdAt }) => (
            <TableRow>
              <>
                <TableCell>
                  <div className="flex gap-2.5 items-center py-1 min-w-[100px]">
                    <span>{name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-[100px]">
                    <div className="w-56 lg:w-56 flex gap-1.5">
                      <div className="truncate w-32">{value.slice(0, 20)}...</div>
                      <button
                        className="opacity-60 hover:opacity-100 hover:text-primary"
                        onClick={() => onCopyToken(value)}
                      >
                        <Icons.copy className="h-3.5 w-3.5 " />
                      </button>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="min-w-[100px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}
                      </TooltipTrigger>
                      <TooltipContent>{dayjs(createdAt).fromNow()}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                <TableCell className="min-w-[100px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>{dayjs().format('YYYY-MM-DD HH:mm:ss')}</TooltipTrigger>
                      <TooltipContent>{dayjs().fromNow()}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="min-w-[80px]">
                  <button
                    onClick={() => onRevoke(id)}
                    className="text-red-600 dark:text-red-600 opacity-80 hover:opacity-100 ease duration-150"
                  >
                    Revoke
                  </button>
                </TableCell>
              </>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CliTokensTable
