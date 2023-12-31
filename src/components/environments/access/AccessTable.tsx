import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EnvironmentToken } from '@/types/tokens/environment'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Tooltip } from '@radix-ui/react-tooltip'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Props {
  data: EnvironmentToken[]
  onRevoke?: (args: { id: string; name: string }) => void
}

const AccessTable: React.FC<Props> = ({ data, onRevoke }) => {
  // const { toast } = useToast()
  //
  // // for diplaying full value
  // const { data: selectedEnvironment } = useSelectedEnvironmentStore()
  // const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)
  //
  // const { isLoading } = useGetEnvironmentToken(
  //   {
  //     envName: selectedEnvironment?.name as string,
  //     tokenId: selectedTokenId as string,
  //     projectName: selectedEnvironment?.projectName as string,
  //     workspaceId: selectedEnvironment?.workspaceId as string,
  //   },
  //   {
  //     enabled: selectedTokenId !== null,
  //     onSettled: () => setSelectedTokenId(null),
  //     onSuccess: (data) => {
  //       copyToken(data.token)
  //     },
  //     onError: (error) => {
  //       const err = envTokensErrorMsgFromCode(error?.code) ?? 'Something went wrong'
  //
  //       toast({
  //         title: err,
  //         variant: 'destructive',
  //       })
  //     },
  //   }
  // )
  //
  // const copyToken = (token: string) => {
  //   navigator.clipboard.writeText(token)
  //   toast({
  //     title: 'Token copied to clipboard!',
  //     variant: 'success',
  //   })
  // }
  //
  // const handleGetFullTokenValue = (id: string) => {
  //   const data = queryClient.getQueryData<FullToken>([
  //     selectedEnvironment?.workspaceId as string,
  //     selectedEnvironment?.projectName as string,
  //     selectedEnvironment?.name as string,
  //     'tokens',
  //     id,
  //   ])
  //
  //   if (data) {
  //     copyToken(data?.token)
  //   } else setSelectedTokenId(id)
  // }
  //
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
            {onRevoke && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, name, last5, permissions, createdAt, expiresAt }) => (
            <TableRow>
              <>
                <TableCell>
                  <div className="flex gap-2.5 items-center py-1 min-w-[100px] xl:min-w-[140px] 2xl:min-w-[190px]">
                    <div
                      className={clsx(['h-2.5 w-2.5 rounded-full mt-[1.5px]'], {
                        // 'bg-primary': !revoked,
                        // 'bg-red-600 dark:bg-red-700': revoked || dayjs(expiresAt).isBefore(dayjs()),
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
                      {/* <div className="truncate w-32">{value.slice(0, 12)}...</div> */}
                      {/* <div className="w-28">{tokenPreview}...</div> */}
                      <div className="w-28">eve...{last5}</div>
                      {/* {selectedTokenId === null ? ( */}
                      {/*   <button */}
                      {/*     className="opacity-60 hover:opacity-100 hover:text-primary" */}
                      {/*     // onClick={() => copyToken(tokenPreview)} */}
                      {/*     onClick={() => handleGetFullTokenValue(id)} */}
                      {/*   > */}
                      {/*     <Icons.copy className="h-3.5 w-3.5 " /> */}
                      {/*   </button> */}
                      {/* ) : ( */}
                      {/*   <> */}
                      {/*     {selectedTokenId === id && isLoading ? ( */}
                      {/*       <Icons.loader2 className="h-3.5 w-3.5 animate-spin text-primary mt-0.5" /> */}
                      {/*     ) : ( */}
                      {/*       <> */}
                      {/*         <button disabled className="opacity-60 cursor-not-allowed"> */}
                      {/*           <Icons.copy className="h-3.5 w-3.5 " /> */}
                      {/*         </button> */}
                      {/*       </> */}
                      {/*     )} */}
                      {/*   </> */}
                      {/* )} */}
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
                {onRevoke && (
                  <TableCell>
                    <button
                      disabled={false}
                      onClick={() => onRevoke({ id, name })}
                      className={clsx([
                        'opacity-80 hover:opacity-100 text-red-600 dark:text-red-600  ease duration-150',
                      ])}
                    >
                      Revoke
                    </button>
                    {/*   {!revoked && !dayjs(expiresAt).isBefore(dayjs()) ? ( */}
                    {/*     <></> */}
                    {/*   ) : ( */}
                    {/*     <span className="opacity-70">-----</span> */}
                    {/*   )} */}
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

export default AccessTable
