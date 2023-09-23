import React from 'react'
import { Environment } from '@/types/environments'
import Link from 'next/link'

interface Props {
  workspaceId: string
  values: Environment[]
  projectName: string
}

export const EnvironmentList: React.FC<Props> = ({workspaceId, projectName, values }) => {
  return (
    <div className="flex flex-col gap-2">
      {values.map((environment, index) => (
        <>
          <Link
            href={`/workspace/${workspaceId}/projects/${projectName}/env/${environment.name}`}
            key={index}
          >
            {environment.name}
          </Link>
        </>
      ))}
    </div>
  )
}
