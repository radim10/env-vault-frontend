'use client'

import dayjs from 'dayjs'
import React, { useState } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import TypographyH4 from '@/components/typography/TypographyH4'
import ChangelogItem from './ChangelogItem'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getEnvChangelog } from '@/api/requests/envChangelog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

dayjs.extend(relativeTime)

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

const Changelog: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  const [hasMore, setHasMore] = useState(true)

  const { data, error, isFetching, isFetchingNextPage, fetchNextPage, isRefetching, refetch } =
    useInfiniteQuery(
      ['changelog', workspaceId, projectName, envName],
      async ({ pageParam = undefined }) => {
        const res = await getEnvChangelog({
          workspaceId,
          projectName,
          envName,
          params: pageParam && {
            date: pageParam?.date,
            id: pageParam?.id,
          },
        })

        setHasMore(res?.hasMore ?? false)

        return res.data
      },
      {
        enabled: true,
        getPreviousPageParam: (firstPage) => {
          return {
            id: firstPage?.[0]?.createdAt ?? undefined,
            date: firstPage?.[0]?.createdAt ?? undefined,
          }
        },
        getNextPageParam: (lastPage) => {
          return {
            id: lastPage?.[lastPage.length - 1]?.id ?? undefined,
            date: lastPage?.[lastPage.length - 1]?.createdAt ?? undefined,
          }
        },
      }
    )

  return (
    <>
      <div className="flex flex-col gap-6 md:gap-8">
        {data?.pages?.flat(1)?.map((val, index) => (
          <div>
            <div className="mb-6">
              {((dayjs(val?.createdAt).hour(12).format('YYYY-MM-DD') !==
                dayjs(data?.pages?.flat(1)?.[index - 1]?.createdAt)
                  .hour(12)
                  .format('YYYY-MM-DD') &&
                index > 0) ||
                index === 0) && (
                <TypographyH4>
                  {dayjs(val?.createdAt).hour(12).format('YYYY-MM-DD') ===
                  dayjs().format('YYYY-MM-DD')
                    ? 'Today'
                    : dayjs(val?.createdAt)?.year() === dayjs().year()
                    ? dayjs(val?.createdAt).hour(12).format('MMMM DD,  dd')
                    : dayjs(val?.createdAt).hour(12).format('YYYY  MMM DD,  dd')}
                </TypographyH4>
              )}
            </div>

            <ChangelogItem
              changes={val?.secretsChanges ?? []}
              createdAt={`${dayjs(val?.createdAt).format('HH:mm')} (${dayjs(
                val?.createdAt
              ).fromNow()})`}
            />
            {/* {index !== 2 && <Separator />} */}
          </div>
        ))}
      </div>

      {hasMore && !isRefetching && !isFetching && !isFetchingNextPage && data && (
        <>
          <div className="w-full flex justify-center mt-8">
            <Button
              variant="outline"
              className="flex items-ceter gap-2"
              onClick={() => fetchNextPage()}
            >
              <Icons.arrowDown className="h-4 w-4" />
              Load more
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default Changelog
