'use client'

import { useListUserSessions } from '@/api/queries/userAuth'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ListSession } from '@/types/session'
import TypographyH4 from '../typography/TypographyH4'
import { Icons } from '../icons'
import dayjs from 'dayjs'

dayjs.extend(relativeTime)

const SessionsSection = (props: {}) => {
  // const data: ListSession[] = [
  //   {
  //     id: 'UUID',
  //     createdAt: '2022-01-01 12:00',
  //     lastActive: '2022-01-01',
  //     metadata: {
  //       ip: '127.0.0.1',
  //       os: 'Linux',
  //       browser: 'Firefox',
  //     },
  //   },
  //
  //   {
  //     id: 'UUID',
  //     createdAt: '2022-01-01',
  //     lastActive: '2022-01-01',
  //     metadata: {
  //       ip: '127.0.0.1',
  //       os: 'Windows',
  //       browser: 'Chrome',
  //     },
  //   },
  // ]

  const { data, isLoading, error } = useListUserSessions()

  if (isLoading) {
    return <>Loading</>
  }

  if (error) {
    return <>Error</>
  }

  return (
    <div>
      <div className="mt-2 gap-2 rounded-md border-2">
        <div className="px-3 py-3 md:px-5 md:py-4">
          <div className="flex items-center justify-between">
            <div className="gap-3 flex items-center">
              <TypographyH4>Sessions</TypographyH4>
              <Icons.shield className="h-5 w-5 opacity-80" />
            </div>
          </div>
          {/* // */}
          <div className="text-[0.95rem] text-muted-foreground mt-2">
            All active sessions with this account
          </div>
        </div>
        {/* // TABLE */}
        <TableComponent data={data} />
      </div>
    </div>
  )
}

const TableComponent = ({ data }: { data: ListSession[] }) => {
  return (
    <>
      <Table>
        <TableHeader className="bg-gray-100/60 hover:bg-gray-100/60 dark:bg-gray-900/80 hover:dark:bg-gray-900/80 sticky">
          <TableRow className="">
            <TableHead className="w-[200px] 2xl:w-[250px]">Created</TableHead>
            <TableHead className="w-">Last active</TableHead>
            <TableHead className="w-">IP address</TableHead>
            <TableHead className="w-">OS</TableHead>
            <TableHead className="w-">Browser</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        {/* // */}
        <TableBody>
          {data.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {dayjs(session.createdAt).format('YYYY-MM-DD HH:mm')}
                    </TooltipTrigger>
                    <TooltipContent>{dayjs(session.createdAt).fromNow()}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>

              <TableCell>{dayjs(session.lastActive).format('YYYY-MM-DD')}</TableCell>
              <TableCell>{session.metadata.ip}</TableCell>
              <TableCell>{session.metadata.os}</TableCell>
              <TableCell>{session.metadata.browser}</TableCell>
              <TableCell>
                <button className="text-red-600 dark:text-red-600  ease duration-150">
                  Revoke
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default SessionsSection
