'use client'

import { useGetSecrets } from '@/api/queries/projects/environments/secrets'
import React from 'react'
import SecretsList from './SecretsList'
import SecretsListSkeleton from './SecretsListSkeleton'
import { selectedProjectStore } from '@/stores/selectedProject'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
}

const SecretsRoot: React.FC<Props> = ({ workspaceId, projectName, envName }) => {
  const { data: secrets, isLoading, error } = useGetSecrets({ workspaceId, projectName, envName })

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
      <SecretsList
        data={secrets}
        readOnly={selectedProjectStore?.getState()?.isMemberRole() === true ? true : false}
      />
    </>
  )
}

export default SecretsRoot
