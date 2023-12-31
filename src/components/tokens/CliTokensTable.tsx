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

dayjs.extend(relativeTime)

interface Props {
  // queryClient: QueryClient
  // workspaceId: string
  // onCopyToken: (token: string) => void
  data: CliToken[]
  onRevoke: (id: string) => void
}

const CliTokensTable: React.FC<Props> = ({ data, onRevoke }) => {
  // const { toast } = useToast()
  // const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)
  //
  // const { isLoading } = useGetCliToken(
  //   {
  //     workspaceId,
  //     tokenId: selectedTokenId as string,
  //   },
  //   {
  //     enabled: selectedTokenId !== null,
  //     onSettled: () => setSelectedTokenId(null),
  //     onSuccess: (data) => {
  //       onCopyToken(data.token)
  //     },
  //     onError: (error) => {
  //       const err = cliTokensErrorMsgFromCode(error?.code) ?? 'Something went wrong'
  //
  //       toast({
  //         title: err,
  //         variant: 'destructive',
  //       })
  //     },
  //   }
  // )
  //
  // const handleGetFullTokenValue = (id: string) => {
  //   const data = queryClient.getQueryData<FullToken>([workspaceId, 'cli-tokens', id])
  //   console.log(data)
  //
  //   if (data) {
  //     onCopyToken(data?.token)
  //   } else setSelectedTokenId(id)
  // }

  return (
    <div>
      <Table>
        {/* {data?.length === 5 && ( */}
        {/*   <TableCaption className="mt-4 mb-7">Showing 5 latest tokens</TableCaption> */}
        {/* )} */}
        {data?.length === 0 && <TableCaption className="mt-10 mb-10">No tokens</TableCaption>}
        <TableHeader className="bg-gray-100/60 hover:bg-gray-100/60 dark:bg-gray-900/80 hover:dark:bg-gray-900/80 sticky">
          <TableRow className="">
            <TableHead className="w-[200px] 2xl:w-[250px]">Name</TableHead>
            <TableHead className="w-[100px]">Token</TableHead>
            <TableHead className="w-">Created</TableHead>
            <TableHead className="w-">Last used</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ id, name, last5, createdAt, lastUsedAt }) => (
            <TableRow>
              <>
                <TableCell>
                  <div className="flex gap-2.5 items-center py-1 min-w-[200px] xl:min-w-[200px] 2xl:min-w-[250px]">
                    <span>{name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-[100px]">
                    <div className="w-32 lg:w-48 2xl:w-64 flex gap-1.5">
                      {/* <div className="w-36 2xl:w-44 flex gap-1.5"> */}
                      {/* <div className="truncate w-28">cli...{last4}</div> */}
                      {/* <div className="w-28">ev.cli...{last4}</div> */}
                      <div className="w-28">evc...{last5}</div>
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
                <TableCell className="min-w-[100px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>{dayjs(createdAt).format('YYYY-MM-DD HH:mm')}</TooltipTrigger>
                      <TooltipContent>{dayjs(createdAt).fromNow()}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                <TableCell className="min-w-[100px]">
                  {lastUsedAt ? (
                    <TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {dayjs(lastUsedAt).format('YYYY-MM-DD HH:mm')}
                          </TooltipTrigger>
                          <TooltipContent>{dayjs(lastUsedAt).fromNow()}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TooltipProvider>
                  ) : (
                    <span>-----</span>
                  )}
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
