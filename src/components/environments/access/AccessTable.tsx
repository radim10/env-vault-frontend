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
import { EnvironmentToken } from '@/types/tokens/environment'
import dayjs from 'dayjs'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { useToast } from '@/components/ui/use-toast'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Props {
  data: EnvironmentToken[]
  onRevoke: (args: { id: string; name: string }) => void
}

const AccessTable: React.FC<Props> = ({ data, onRevoke }) => {
  const { toast } = useToast()

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast({
      title: 'Token copied to clipboard!',
      variant: 'success',
    })
  }

  return (
    <div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="bg-gray-100/60 hover:bg-gray-100/60 dark:bg-gray-900/80 hover:dark:bg-gray-900/80 sticky">
          <TableRow className="">
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[120px]">Token</TableHead>
            <TableHead>Grant</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, name, value, grant, revoked, createdAt, expiresAt }) => (
            <TableRow>
              <>
                <TableCell>
                  <div className="flex gap-2.5 items-center py-1 min-w-[100px]">
                    <div
                      className={clsx(['h-2.5 w-2.5 rounded-full mt-[1.5px]'], {
                        'bg-primary': !revoked,
                        'bg-red-600 dark:bg-red-700': revoked || dayjs(expiresAt).isBefore(dayjs()),
                      })}
                    />
                    <span>{name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-[100px]">
                    <div className="w-36 lg:w-44 flex gap-1.5">
                      <div className="truncate w-32">{value.slice(0, 12)}...</div>
                      <button
                        className="opacity-60 hover:opacity-100 hover:text-primary"
                        onClick={() => copyToken(value)}
                      >
                        <Icons.copy className="h-3.5 w-3.5 " />
                      </button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {grant.toString() === 'READ' && 'Read'}
                  {grant.toString() === 'WRITE' && 'Write'}
                  {grant.toString() === 'READ_WRITE' && 'R/W'}
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
                <TableCell
                  className={clsx(['min-w-[100px]'], {
                    'text-red-600 dark:text-red-600':
                      !revoked && dayjs(expiresAt).isBefore(dayjs()),
                  })}
                >
                  {expiresAt ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {dayjs(expiresAt).format('YYYY-MM-DD HH:mm:ss')}
                        </TooltipTrigger>
                        <TooltipContent>{dayjs(expiresAt).fromNow()}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="opacity-70">-----</span>
                  )}
                </TableCell>
                <TableCell>
                  {!revoked && !dayjs(expiresAt).isBefore(dayjs()) ? (
                    <button
                      onClick={() => onRevoke({ id, name })}
                      className="text-red-600 dark:text-red-600 opacity-80 hover:opacity-100 ease duration-150"
                    >
                      Revoke
                    </button>
                  ) : (
                    <span className="opacity-70">-----</span>
                  )}
                </TableCell>
              </>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AccessTable
