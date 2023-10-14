'use client'

import dayjs from 'dayjs'
import React, { useState } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import TypographyH4 from '@/components/typography/TypographyH4'
import ChangelogItem from './ChangelogItem'
import { Separator } from '@/components/ui/separator'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getEnvChangelog } from '@/api/requests/envChangelog'

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
      <div className="mb-6">
        <TypographyH4>Today</TypographyH4>
      </div>

      <div className="flex flex-col gap-6 md:gap-12">
        {data?.pages?.flat(1)?.map((val, index) => (
          <>
            <ChangelogItem changes={val?.secretsChanges ?? []} />
            {/* {index !== 2 && <Separator />} */}
          </>
        ))}
      </div>
    </>
  )
}

export default Changelog
