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
import { ReadOnlyEnvToken } from '@/types/tokens/environment'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'

dayjs.extend(relativeTime)

interface Props {
  workspaceId: string
  data: ReadOnlyEnvToken[]
}

const EnvTokensTable: React.FC<Props> = ({ workspaceId, data }) => {
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
            <TableHead>Permission</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ name, last5, permissions, createdAt, expiresAt, ref }) => (
            <TableRow>
              <>
                <TableCell>
                  {/* <div className="flex gap-2.5 items-center py-1 min-w-[100px]"> */}
                  <div className="flex gap-2.5 items-center py-1 min-w-[100px] xl:min-w-[140px] 2xl:min-w-[190px]">
                    <div
                      className={clsx(['h-2.5 w-2.5 rounded-full mt-[1.5px]'], {
                        'bg-primary': !dayjs(expiresAt).isBefore(dayjs()),
                        'bg-red-600 dark:bg-red-700': dayjs(expiresAt).isBefore(dayjs()),
                      })}
                    />
                    <span>{name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-[100px]">
                    <div className="w-32 lg:w-32 2xl:w-44 flex gap-1.5">
                      {/* <div className="truncate w-32">{tokenPreview}...</div> */}
                      <div className="w-32">eve...{last5}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {/* {permission.toString() === 'READ' && 'Read'} */}
                  {/* {permission.toString() === 'WRITE' && 'Write'} */}
                  {/* {permission.toString() === 'READ_WRITE' && 'R/W'} */}

                  {/* / Env read by default */}
                  {/* <>{'ER, '}</> */}
                  {permissions.includes('read') && (
                    <>
                      SR
                      {/* Read */}
                      {(permissions?.includes('write') || permissions?.includes('delete')) && ', '}
                    </>
                  )}

                  {permissions.includes('write') && (
                    <>
                      {/* Write */}
                      SW
                      {permissions?.includes('delete') && ', '}
                    </>
                  )}
                  {permissions.includes('delete') && (
                    <>
                      {/* Delete */}
                      SD
                    </>
                  )}
                </TableCell>
                <TableCell className="min-w-[100px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>{dayjs(createdAt).format('YYYY-MM-DD HH:mm')}</TooltipTrigger>
                      <TooltipContent>{dayjs(createdAt).fromNow()}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell
                  className={clsx(['min-w-[100px]'], {
                    'text-red-600 dark:text-red-600': dayjs(expiresAt).isBefore(dayjs()),
                  })}
                >
                  {expiresAt ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {dayjs(expiresAt).format('YYYY-MM-DD HH:mm')}
                        </TooltipTrigger>
                        <TooltipContent>{dayjs(expiresAt).fromNow()}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="opacity-70">-----</span>
                  )}
                </TableCell>
                <TableCell className="min-w-[80px]">
                  <Link
                    href={`/workspace/${workspaceId}/projects/${ref.project}/env/${ref.environment}/tokens`}
                  >
                    <button className="text-primary dark:text-primary ease duration-150">
                      Details
                    </button>
                  </Link>
                </TableCell>
              </>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default EnvTokensTable
