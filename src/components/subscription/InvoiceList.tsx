import { useInfiniteQuery } from '@tanstack/react-query'
import { Icons } from '../icons'
import SubscriptionLayout from './SubscriptionLayout'
import { useMemo } from 'react'
import { listInvoices } from '@/api/requests/subscription'
import { Button } from '../ui/button'
import dayjs from 'dayjs'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'

interface Props {
  workspaceId: string
}

const InvoiceList: React.FC<Props> = ({ workspaceId }) => {
  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    isLoading,
    refetch,
  } = useInfiniteQuery(
    [workspaceId, 'invoices'],
    async ({ pageParam }) => {
      const cursor = pageParam ? pageParam : undefined

      const res = await listInvoices({
        workspaceId,
        cursor,
      })

      return res
      // return res.data
    },
    {
      enabled: true,
      structuralSharing: false,
      getPreviousPageParam: (firstPage) => firstPage?.cursor,
      getNextPageParam: (lastPage) => lastPage?.cursor,
    }
  )

  const flattenedData = useMemo(
    () => (data ? data?.pages.flatMap((item) => item.data) : []),
    [data]
  )

  if (isLoading) {
    return <Skeleton className=" border-2 h-40 w-full" />
  }

  return (
    <SubscriptionLayout title="Invoices" icon={Icons.receipt}>
      {(error as any) && (
        <div className="h-44 flex flex-row items-center">
          <div className="flex flex-col gap-2 w-full items-center">
            <div className="text-red-600 text-[0.92rem]">Something went wrong</div>
            <div>
              <Button size={'sm'} variant="outline" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      )}
      {!error && (
        <>
          {flattenedData?.length === 0 && (
            <div className="flex justify-center items-center my-5">
              <div className="text-[0.92rem]">No invoices</div>
            </div>
          )}
          {flattenedData?.length !== 0 && (
            <div className="flex flex-col gap-3">
              {flattenedData.map((item, index) => (
                <>
                  <div className="hidden md:flex flex-row gap-3 items-center justify-between">
                    <div className="gap-3 grid grid-cols-3 items-center w-full text-[0.93rem]">
                      <div>#{item?.number}</div>
                      <div>{dayjs(item?.createdAt).format('YYYY-MM-DD')}</div>
                      <div>${item?.amount}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        window.open(item.url as string, '_blank')
                      }}
                    >
                      <Icons.download className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="md:hidden flex flex-row gap-3 items-center justify-between text-[0.93rem]">
                    <div className="flex flex-col gap-2">
                      <div>#{item?.number}</div>
                      <div>{dayjs(item?.createdAt).format('YYYY-MM-DD')}</div>
                      <div>${item?.amount}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        window.open(item.url as string, '_blank')
                      }}
                    >
                      <Icons.download className="h-4 w-4" />
                    </Button>
                  </div>
                  {index !== flattenedData.length - 1 && <Separator />}
                </>
              ))}
            </div>
          )}

          {isFetchingNextPage && (
            <div className="w-full flex flex-col gap-3 mt-3">
              {Array.from({ length: 3 }).map(() => (
                <Skeleton className="h-9 " />
              ))}
            </div>
          )}
          {!isFetchingNextPage && hasNextPage && (
            <div className="flex justify-center items-center mt-5">
              <Button
                className="w-fit"
                variant="outline"
                size={'sm'}
                onClick={() => fetchNextPage()}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </SubscriptionLayout>
  )
}

export default InvoiceList
