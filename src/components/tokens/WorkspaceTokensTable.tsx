import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import dayjs from 'dayjs'
import { Icons } from '@/components/icons'
import clsx from 'clsx'
import { useToast } from '@/components/ui/use-toast'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import relativeTime from 'dayjs/plugin/relativeTime'
import { QueryClient } from '@tanstack/react-query'
import { FullToken } from '@/types/tokens/token'
import { WorkspaceToken } from '@/types/tokens/workspace'
import { useGetWorkspaceToken } from '@/api/queries/projects/tokens'
import { tokensErrorMsgFromCode } from '@/api/requests/tokens'

dayjs.extend(relativeTime)

interface Props {
  queryClient: QueryClient
  workspaceId: string
  data: WorkspaceToken[]
  onRevoke: (args: { id: string; name: string }) => void
}

const WorkspceTokensTable: React.FC<Props> = ({ workspaceId, queryClient, data, onRevoke }) => {
  const { toast } = useToast()

  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)

  const { isLoading } = useGetWorkspaceToken(
    {
      workspaceId,
      tokenId: selectedTokenId as string,
    },
    {
      enabled: selectedTokenId !== null,
      onSettled: () => setSelectedTokenId(null),
      onSuccess: (data) => {
        copyToken(data.token)
      },
      onError: (error) => {
        const err = tokensErrorMsgFromCode(error?.code) ?? 'Something went wrong'

        toast({
          title: err,
          variant: 'destructive',
        })
      },
    }
  )

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast({
      title: 'Token copied to clipboard!',
      variant: 'success',
    })
  }

  const handleGetFullTokenValue = (id: string) => {
    const data = queryClient.getQueryData<FullToken>([workspaceId, 'workspace-tokens', id])

    if (data) {
      copyToken(data?.token)
    } else setSelectedTokenId(id)
  }

  return (
    <div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader className="bg-gray-100/60 hover:bg-gray-100/60 dark:bg-gray-900/80 hover:dark:bg-gray-900/80 sticky">
          <TableRow className="">
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[120px]">Token</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, name, last5, permissions, revoked, createdAt, expiresAt }) => (
            <TableRow>
              <>
                <TableCell>
                  <div className="flex gap-2.5 items-center py-1 min-w-[100px] xl:min-w-[150px] 2xl:min-w-[200px]">
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
                    {/* <div className="w-36 lg:w-44 flex gap-1.5"> */}
                    {/* <div className="w-56 lg:w-56 2xl:w-56 flex gap-1.5"> */}
                    <div className="w-32 lg:w-32 2xl:w-44 flex gap-1.5">
                      {/* <div className="truncate w-32">{value.slice(0, 12)}...</div> */}
                      {/* <div className="w-28">{tokenPreview}...</div> */}
                      <div className="w-28">eva...{last5}</div>
                      {/*   {selectedTokenId === null ? ( */}
                      {/*     <button */}
                      {/*       className="opacity-60 hover:opacity-100 hover:text-primary" */}
                      {/*       // onClick={() => copyToken(tokenPreview)} */}
                      {/*       onClick={() => handleGetFullTokenValue(id)} */}
                      {/*     > */}
                      {/*       <Icons.copy className="h-3.5 w-3.5 " /> */}
                      {/*     </button> */}
                      {/*   ) : ( */}
                      {/*     <> */}
                      {/*       {selectedTokenId === id && isLoading ? ( */}
                      {/*         <Icons.loader2 className="h-3.5 w-3.5 animate-spin text-primary mt-0.5" /> */}
                      {/*       ) : ( */}
                      {/*         <> */}
                      {/*           <button disabled className="opacity-60 cursor-not-allowed"> */}
                      {/*             <Icons.copy className="h-3.5 w-3.5 " /> */}
                      {/*           </button> */}
                      {/*         </> */}
                      {/*       )} */}
                      {/*     </> */}
                      {/*   )} */}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="min-w-[100px] max-w-[200px]">
                  {permissions?.projects?.length === 3 &&
                  permissions?.secrets?.length === 3 &&
                  permissions?.environments?.length === 3 ? (
                    <div>All permissions</div>
                  ) : (
                    <>
                      {permissions.projects && permissions?.projects?.length > 0 && (
                        <>
                          {permissions.projects
                            ?.map((val) => 'P' + val.charAt(0).toUpperCase())
                            .join(', ')}
                          {(permissions?.secrets || permissions?.environments) && ', '}
                        </>
                      )}

                      {permissions.environments && permissions?.environments?.length > 0 && (
                        <>
                          {permissions.environments
                            ?.map((val) => 'E' + val.charAt(0).toUpperCase())
                            .join(', ')}
                          {permissions?.secrets && ', '}
                        </>
                      )}

                      {permissions.secrets && permissions?.secrets?.length > 0 && (
                        <>
                          {permissions.secrets
                            ?.map((val) => 'S' + val.charAt(0).toUpperCase())
                            .join(', ')}
                        </>
                      )}
                    </>
                  )}

                  {/* {permissions.projects && permissions?.projects?.length > 0 && ( */}
                  {/*   <> */}
                  {/*     Projects:{' '} */}
                  {/*     {permissions.projects.map((val) => val.charAt(0).toUpperCase()).join(', ')} */}
                  {/*     {permissions?.secrets || permissions?.environments ? ', ' : ''} */}
                  {/*   </> */}
                  {/* )} */}
                  {/**/}
                  {/* {permissions.environments && permissions?.environments?.length > 0 && ( */}
                  {/*   <> */}
                  {/*     Environments:{' '} */}
                  {/*     {permissions.environments */}
                  {/*       .map((val) => val.charAt(0).toUpperCase()) */}
                  {/*       .join(', ')} */}
                  {/*     {permissions?.secrets && ', '} */}
                  {/*   </> */}
                  {/* )} */}
                  {/**/}
                  {/* {permissions.secrets && permissions?.secrets?.length > 0 && ( */}
                  {/*   <>Projects: {permissions.secrets.join(', ').charAt(0).toUpperCase()}</> */}
                  {/* )} */}

                  {/* {grant.toString() === 'READ' && 'Read'} */}
                  {/* {grant.toString() === 'WRITE' && 'Write'} */}
                  {/* {grant.toString() === 'READ_WRITE' && 'R/W'} */}
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
                    'text-red-600 dark:text-red-600':
                      !revoked && dayjs(expiresAt).isBefore(dayjs()),
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
                {onRevoke && (
                  <TableCell>
                    {!revoked && !dayjs(expiresAt).isBefore(dayjs()) ? (
                      <button
                        disabled={false}
                        onClick={() => onRevoke({ id, name })}
                        className={clsx([
                          'opacity-80 hover:opacity-100 text-red-600 dark:text-red-600  ease duration-150',
                        ])}
                      >
                        Revoke
                      </button>
                    ) : (
                      <span className="opacity-70">-----</span>
                    )}
                  </TableCell>
                )}
              </>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default WorkspceTokensTable
