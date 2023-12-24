'use client'

import { useMount } from 'react-use'
import { Button } from '../ui/button'
import SecretsList from './SecretsList'
import SecretsListSkeleton from './SecretsListSkeleton'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import { useGetSecrets } from '@/api/queries/projects/environments/secrets'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

const SecretsRoot: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  const {
    isViewerRole,
    data: selectedEnvironment,
    update: updateSelectedEnvironment,
  } = useSelectedEnvironmentStore()

  const {
    data: secrets,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetSecrets(
    { workspaceId, projectName, envName },
    {
      onSuccess: () => {
        if (selectedEnvironment) {
          updateSelectedEnvironment({ secretsLoaded: true })
        }
      },
      enabled: false,
      refetchOnMount: false,
      // enabled: data?.loadedSecrets,
      // queryClient.getQueryData([workspaceId, projectName, envName, 'secrets']) !== undefined,
      //     queryClient.getQueryData([workspaceId, projectName, envName, 'secrets']) === undefined
      //       ? false
      //       : true,
    }
  )

  useMount(() => {
    if (selectedEnvironment?.secretsLoaded) {
      refetch()
    }
  })

  if (secrets === undefined && !isFetching) {
    return (
      <>
        <div className="rounded-md border h-80 bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center gap-3 md:gap-4 h-full">
            {/* <Icons.users2 className="w-12 h-12 opacity-40" /> */}
            <div className="flex flex-col gap-0 items-center">
              <Button className="gap-2" size={'sm'} onClick={() => refetch()} variant="default">
                Show secrets
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isLoading) {
    return (
      <div>
        <SecretsListSkeleton />
      </div>
    )
  }

  if (error) {
    return <div>Error getting secrets</div>
  }

  return (
    <>
      <SecretsList data={secrets} readOnly={isViewerRole() === true ? true : false} />
    </>
  )
}

export default SecretsRoot
