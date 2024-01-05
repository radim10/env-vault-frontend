import { useInfiniteQuery } from '@tanstack/react-query'
import { Icons } from '../icons'
import SubscriptionLayout from './SubscriptionLayout'
import { useMemo, useState } from 'react'
import { listInvoices } from '@/api/requests/subscription'
import { Button } from '../ui/button'
import dayjs from 'dayjs'
import { Separator } from '../ui/separator'

interface Props {
  workspaceId: string
}

const InvoiceList: React.FC<Props> = ({ workspaceId }) => {
  const [hasMore, setHasMore] = useState(true)

  const { data, error, isFetching, isFetchingNextPage, fetchNextPage, isRefetching, isLoading } =
    useInfiniteQuery(
      [workspaceId, 'invoices'],
      async ({ pageParam }) => {
        const cursor = pageParam ? pageParam : undefined

        const res = await listInvoices({
          workspaceId,
          cursor,
        })

        setHasMore(res?.cursor ? true : false)

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
    return <>Loading...</>
  }

  return (
    <SubscriptionLayout title="Invoices" icon={Icons.receipt}>
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

      {isFetchingNextPage && <div>Loading...</div>}
      {!isFetchingNextPage && hasMore && (
        <div className="flex justify-center items-center mt-5">
          <Button className="w-fit" variant="outline" size={'sm'}>
            Load more
          </Button>
        </div>
      )}
    </SubscriptionLayout>
  )
}

export default InvoiceList
