'use client'

import dayjs from 'dayjs'
import React, { useState } from 'react'
import relativeTime from 'dayjs/plugin/relativeTime'
import TypographyH4 from '@/components/typography/TypographyH4'
import ChangelogItem from './ChangelogSecretsItem'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { getEnvChangelogItems } from '@/api/requests/envChangelog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import ChangelogItemSkeleton from './ChangelogItemSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import RollbackDialog from './RollbackDialog'
import { EnvChangelogItem, SecretsChange } from '@/types/envChangelog'
import { useToast } from '@/components/ui/use-toast'

dayjs.extend(relativeTime)

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

const Changelog: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [hasMore, setHasMore] = useState(true)
  const [rollbackDialogChangeId, setRollbackDialogChangeId] = useState<string | null>(null)

  const {
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    isRefetching,
    refetch,
    isLoading,
  } = useInfiniteQuery(
    ['changelog', workspaceId, projectName, envName],
    async ({ pageParam = undefined }) => {
      const res = await getEnvChangelogItems({
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
      structuralSharing: false,
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

  const handleRollbackData = (newItem: EnvChangelogItem) => {
    const key = ['changelog', workspaceId, projectName, envName]
    const existingData = queryClient?.getQueryData<{ pages: Array<EnvChangelogItem[]> }>(key)

    if (existingData) {
      const firstPage = existingData?.pages?.[0]
      if (!firstPage) return

      const updatedPage = [newItem, ...firstPage]
      const updatedData = { ...existingData }

      updatedData.pages[0] = updatedPage

      queryClient.setQueryData(key, updatedData)
    }

    closeDialog()

    toast({
      title: 'Rollback has been completed',
      variant: 'success',
    })
  }

  const handleNoChangesToRollback = () => {
    toast({
      title: 'No changes to rollback',
      description: 'This is current secrets state',
      variant: 'info',
    })
    closeDialog()
  }

  const handleFetchedSecretValues = (args: {
    page: number
    changeId: string
    secrets: SecretsChange[]
  }) => {
    const { page, changeId, secrets } = args

    const key = ['changelog', workspaceId, projectName, envName]
    const existingData = queryClient?.getQueryData<{ pages: Array<EnvChangelogItem[]> }>(key)

    if (existingData) {
      const pageData = existingData?.pages?.[page]
      if (!pageData) return

      const updatedPage = [...pageData]
      const item = updatedPage?.find((val) => val?.id === changeId)

      if (!item) return
      const itemIndex = updatedPage?.findIndex((val) => val?.id === changeId)

      if (itemIndex === -1) return
      const updatedItem = { ...item, secretsChanges: secrets }

      console.log('Updated item:\n', updatedItem)
      updatedPage[itemIndex] = updatedItem

      const updatedData = { ...existingData }
      updatedData.pages[page] = updatedPage

      console.log(updatedData)

      queryClient.setQueryData(key, updatedData)
    }
  }

  const closeDialog = () => setRollbackDialogChangeId(null)

  if (isLoading || isRefetching) {
    return (
      <>
        <Skeleton className="h-7 w-28 mb-6" />
        <div className="flex flex-col gap-11 md:gap-11">
          <ChangelogItemSkeleton />
          <ChangelogItemSkeleton />
        </div>
      </>
    )
  }

  return (
    <>
      <RollbackDialog
        workspaceId={workspaceId}
        projectName={projectName}
        envName={envName}
        changeId={rollbackDialogChangeId ?? ''}
        opened={rollbackDialogChangeId !== null}
        onClose={() => setRollbackDialogChangeId(null)}
        onSuccess={(item) => {
          if (item) handleRollbackData(item)
          if (!item) handleNoChangesToRollback()
        }}
      />
      <div className="flex flex-col gap-5 md:gap-5">
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
              key={index}
              workspaceId={workspaceId}
              projectName={projectName}
              envName={envName}
              changeId={val?.id}
              valuesLoaded={queryClient?.getQueryData(['changelog-secrets', val?.id]) !== undefined}
              changes={
                queryClient?.getQueryData(['changelog-secrets', val?.id]) ??
                val?.secretsChanges ??
                []
              }
              createdAt={`${dayjs(val?.createdAt).format('HH:mm')} (${dayjs(
                val?.createdAt
              ).fromNow()})`}
              onRollback={() => setRollbackDialogChangeId(val?.id)}
              onValuesLoaded={(values) =>
                handleFetchedSecretValues({
                  page: Math.ceil((index + 1) / 5) - 1,
                  changeId: val?.id,
                  secrets: values,
                })
              }
              onError={() => {
                toast({
                  title: 'Something went wrong',
                  variant: 'destructive',
                })
              }}
            />
            {/* {index !== 2 && <Separator />} */}
          </div>
        ))}

        {isFetchingNextPage && (
          <div className="mt-6">
            <ChangelogItemSkeleton count={1} />
          </div>
        )}
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
