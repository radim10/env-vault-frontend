'use client'

import clsx from 'clsx'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import relativeTime from 'dayjs/plugin/relativeTime'
import TypographyH4 from '@/components/typography/TypographyH4'
import ChangelogSecretsItem from './ChangelogSecretsItem'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { getEnvChangelogItems } from '@/api/requests/envChangelog'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'
import ChangelogItemSkeleton from './ChangelogItemSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import RevertChangeDialog from './RevertChangeDialog'
import { EnvChangelogItem, SecretsChange } from '@/types/envChangelog'
import { useToast } from '@/components/ui/use-toast'
import Error from '@/components/Error'
import ChangelogItem from './ChangelogItem'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import { useSelectedProjectStore } from '@/stores/selectedProject'

dayjs.extend(relativeTime)

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

const Changelog: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { toast } = useToast()
  const queryClient = useQueryClient()
  const selectedEnvironment = useSelectedEnvironmentStore()
  const selectedProject = useSelectedProjectStore()

  const [hasMore, setHasMore] = useState(true)
  const [rollbackDialog, setRollbackDialog] = useState<{ id: string; secrets: boolean } | null>(
    null
  )

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    if (
      searchParams.get('only-secrets') === 'true' &&
      selectedEnvironment?.changelogFilter !== 'secrets'
    ) {
      selectedEnvironment.setChangelogFilter('secrets')
    }

    if (
      searchParams.get('only-secrets') !== 'false' &&
      selectedEnvironment?.changelogFilter === 'secrets'
    ) {
      selectedEnvironment.setChangelogFilter(null)
    }
  }, [searchParams])

  const { data, error, isFetching, isFetchingNextPage, fetchNextPage, isRefetching, isLoading } =
    useInfiniteQuery(
      [
        'changelog',
        workspaceId,
        projectName,
        envName,
        searchParams?.get('only-secrets') === 'true' ? 'only-secrets' : null,
      ],
      async ({ pageParam }) => {
        const onlySecrets = searchParams.get('only-secrets') === 'true'
        const offset = pageParam ? pageParam : undefined

        const res = await getEnvChangelogItems({
          workspaceId,
          projectName,
          envName,
          params:
            offset || onlySecrets
              ? {
                  offset,
                  // date: pageParam?.date ?? undefined,
                  // id: pageParam?.id ?? undefined,
                  'only-secrets': onlySecrets ?? undefined,
                }
              : undefined,
        })

        setHasMore(res?.hasMore ?? false)

        return res
        // return res.data
      },
      {
        enabled: true,
        structuralSharing: false,
        getPreviousPageParam: (firstPage) => firstPage?.offset,
        getNextPageParam: (lastPage) => lastPage?.offset,
        // getPreviousPageParam: (firstPage) => {
        //   return {
        //     id: firstPage?.[0]?.createdAt ?? undefined,
        //     date: firstPage?.[0]?.createdAt ?? undefined,
        //   }
        // },
        // getNextPageParam: (lastPage) => {
        //   return {
        //     id: lastPage?.[lastPage.length - 1]?.id ?? undefined,
        //     date: lastPage?.[lastPage.length - 1]?.createdAt ?? undefined,
        //   }
        // },
      }
    )

  const observer = useRef<IntersectionObserver>()
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          fetchNextPage()
        }
      })
      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, fetchNextPage, isFetching]
  )

  const flattenedData = useMemo(
    () => (data ? data?.pages.flatMap((item) => item.data) : []),
    [data]
  )

  const handleRollbackData = (newItem: EnvChangelogItem) => {
    const key = [
      'changelog',
      workspaceId,
      projectName,
      envName,
      searchParams?.get('only-secrets') === 'true' ? 'only-secrets' : null,
    ]
    const existingData = queryClient?.getQueryData<{ pages: Array<EnvChangelogItem[]> }>(key)

    if (existingData) {
      const firstPage = existingData?.pages?.[0]
      if (!firstPage) return

      const updatedPage = [newItem, ...firstPage]
      const updatedData = { ...existingData }

      updatedData.pages[0] = updatedPage

      if (newItem?.change?.action === 'secrets') {
        queryClient.setQueryData(key, updatedData)
      }

      if (newItem?.change) {
        const change = newItem?.change

        if (change?.action === 'renamed') {
          // navigate + chache
          handleRenameRollback({
            newName: change?.new,
            changelogKey: key,
            updatedData,
          })
        } else if (change?.action === 'type') {
          selectedEnvironment?.update({ type: change?.new })
          // update state + cache
        } else if (change?.action === 'lock') {
          selectedEnvironment?.update({ locked: change?.locked })
          // state + cache
        }
      }
    }

    closeDialog()

    toast({
      title: 'Revert has been completed',
      variant: 'success',
    })
  }

  const handleRenameRollback = (args: {
    changelogKey: Array<string | null>
    newName: string
    updatedData: {
      pages: Array<EnvChangelogItem[]>
    }
  }) => {
    const { changelogKey, updatedData, newName } = args

    queryClient.setQueryData(
      [
        'changelog',
        workspaceId,
        projectName,
        newName,
        searchParams?.get('only-secrets') === 'true' ? 'only-secrets' : null,
      ],
      updatedData
    )
    queryClient.setQueryData(changelogKey, null)

    // update env cache
    const existingEnvData = queryClient.getQueryData([workspaceId, projectName, envName])

    if (existingEnvData) {
      // ???
      // queryClient.removeQueries([workspaceId, projectName], { exact: false })
      queryClient.invalidateQueries([workspaceId, projectName], { exact: false })

      queryClient.setQueryData([workspaceId, projectName, envName], null)
      queryClient.setQueryData([workspaceId, projectName, newName], existingEnvData)
    }

    // secrets:
    const existingSecretsData = queryClient.getQueryData([
      workspaceId,
      projectName,
      envName,
      'secrets',
    ])

    if (existingSecretsData) {
      queryClient.getQueryData([workspaceId, projectName, newName, 'secrets'], existingSecretsData)
    }
    // TODO: maybe do other???

    selectedEnvironment?.update({ name: newName })

    router.push(`/workspace/${workspaceId}/projects/${projectName}/env/${newName}/changelog`)
  }

  const handleNoChangesToRollback = (isSecrets: boolean) => {
    toast({
      title: 'No changes to revert',
      description: isSecrets
        ? 'This is current secrets state'
        : 'This is current environment state',
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

    const key = [
      'changelog',
      workspaceId,
      projectName,
      envName,
      searchParams?.get('only-secrets') === 'true' ? 'only-secrets' : null,
    ]
    const existingData = queryClient?.getQueryData<{ pages: Array<EnvChangelogItem[]> }>(key)

    if (existingData) {
      const pageData = existingData?.pages?.[page]
      if (!pageData) return

      const updatedPage = [...pageData]
      const item = updatedPage?.find((val) => val?.id === changeId)

      if (!item) return
      const itemIndex = updatedPage?.findIndex((val) => val?.id === changeId)

      if (itemIndex === -1) return
      // const updatedItem = { ...item, secretsChanges: secrets }
      const updatedItem = { ...item, change: { ...item.change, data: secrets } }

      console.log('Updated item:\n', updatedItem)
      updatedPage[itemIndex] = updatedItem

      const updatedData = { ...existingData }
      updatedData.pages[page] = updatedPage

      console.log(updatedData)

      queryClient.setQueryData(key, updatedData)
    }
  }

  const closeDialog = () => setRollbackDialog(null)

  if (isLoading) {
    return (
      <>
        <div className="flex justify-end mb-0">
          <Skeleton className="h-9 w-32 " />
        </div>
        <div>
          <Skeleton className="h-7 w-28 mb-6" />
          <div className="flex flex-col gap-11 md:gap-11">
            <ChangelogItemSkeleton />
            <ChangelogItemSkeleton />
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return <Error />
  }

  return (
    <>
      <RevertChangeDialog
        workspaceId={workspaceId}
        projectName={projectName}
        envName={envName}
        changeId={rollbackDialog?.id ?? ''}
        opened={rollbackDialog !== null}
        onClose={() => setRollbackDialog(null)}
        onSuccess={(item) => {
          if (item) handleRollbackData(item)
          if (!item) handleNoChangesToRollback(rollbackDialog?.secrets ? true : false)
        }}
      />
      <div className="">
        <div className="flex w-fill justify-end items-center">
          <Button
            size={'sm'}
            variant={searchParams.get('only-secrets') === 'true' ? 'secondary' : 'outline'}
            className={clsx(['gap-2'], {
              'text-primary': searchParams.get('only-secrets') === 'true',
              'hover:text-primary hover:border-primary hover:bg-transparent':
                searchParams.get('only-secrets') !== 'true',
            })}
            onClick={() => {
              const onlySecrets = searchParams.get('only-secrets') === 'true'

              if (onlySecrets) {
                router.push(pathname)
              } else {
                router.push(pathname + '?' + createQueryString('only-secrets', 'true'))
              }
            }}
          >
            <Icons.squareAsterisk className="h-4 w-4" />
            <span>Only secrets</span>
          </Button>
        </div>
        {/* //List */}
        <div className="flex flex-col gap-5 md:gap-4">
          {flattenedData?.map((val, index) => (
            <div>
              <div
                key={index}
                ref={flattenedData.length === index + 1 ? lastElementRef : null}
                className={clsx(['mb-6'], {
                  'mt-2': index,
                })}
              >
                {((dayjs(val?.createdAt).hour(12).format('YYYY-MM-DD') !==
                  dayjs(flattenedData?.[index - 1]?.createdAt)
                    .hour(12)
                    .format('YYYY-MM-DD') &&
                  index > 0) ||
                  index === 0) && (
                  <div
                    className={clsx({
                      'mt-8': index,
                    })}
                  >
                    <TypographyH4>
                      {dayjs(val?.createdAt).hour(12).format('YYYY-MM-DD') ===
                      dayjs().format('YYYY-MM-DD')
                        ? 'Today'
                        : dayjs(val?.createdAt)?.year() === dayjs().year()
                        ? dayjs(val?.createdAt).hour(12).format('MMMM DD,  dd')
                        : dayjs(val?.createdAt).hour(12).format('YYYY  MMM DD,  dd')}
                    </TypographyH4>
                  </div>
                )}
              </div>

              {val?.change?.action === 'secrets' && (
                <ChangelogSecretsItem
                  id={val?.id}
                  key={val?.id}
                  workspaceId={workspaceId}
                  projectName={projectName}
                  envName={envName}
                  user={val?.user}
                  changeId={val?.id}
                  readOnly={selectedProject?.isMemberRole() ?? false}
                  valuesLoaded={
                    queryClient?.getQueryData(['changelog-secrets', val?.id]) !== undefined
                  }
                  changes={
                    queryClient?.getQueryData(['changelog-secrets', val?.id]) ??
                    val?.change?.data ??
                    []
                  }
                  createdAt={`${dayjs(val?.createdAt).format('HH:mm')} (${dayjs(
                    val?.createdAt
                  ).fromNow()})`}
                  onRollback={() => setRollbackDialog({ id: val?.id, secrets: true })}
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
              )}
              {val?.change?.action !== 'secrets' && (
                <ChangelogItem
                  readOnly={selectedProject.isAdminRole() !== true}
                  user={val?.user}
                  change={val.change}
                  id={
                    val?.change?.action !== 'created' && val?.change?.action !== 'description'
                      ? val?.id
                      : undefined
                  }
                  createdAt={`${dayjs(val?.createdAt).format('HH:mm')} (${dayjs(
                    val?.createdAt
                  ).fromNow()})`}
                  onRollback={() => setRollbackDialog({ id: val?.id, secrets: false })}
                />
              )}
              {/* {index !== 2 && <Separator />} */}
            </div>
          ))}
        </div>

        {isFetchingNextPage && (
          <div className="mt-10">
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
