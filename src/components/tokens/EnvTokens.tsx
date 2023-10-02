'use client'

import React from 'react'
import AccessTable from '../environments/access/AccessTable'
import Error from '@/components/Error'
import TypographyH4 from '../typography/TypographyH4'
import { useGetEnvTokens } from '@/api/queries/projects/tokens'
import { Skeleton } from '../ui/skeleton'
import EnvTokensTable from './Table'

interface Props {
  workspaceId: string
}

const EnvTokens: React.FC<Props> = ({ workspaceId }) => {
  const { data, isLoading, error } = useGetEnvTokens({
    workspaceId,
  })

  if (isLoading) {
    return <Skeleton className="mt-2 border-2 h-72 w-full" />
  }

  if (error) {
    return <Error />
  }

  return (
    <div>
      <div className="mt-2 gap-2 rounded-md border-2">
        <div className="px-3 py-3 md:px-5 md:py-4">
          <div className="flex items-center justify-between">
            <TypographyH4>Environment tokens (for SDKs)</TypographyH4>
          </div>
          {/* // */}
          <div className="text-[0.95rem] text-muted-foreground mt-1 md:mt-0">
            Environment tokens are used with SDKs to access only selected environments.
          </div>
        </div>
        <EnvTokensTable workspaceId={workspaceId} data={data} />
      </div>
    </div>
  )
}

export default EnvTokens
