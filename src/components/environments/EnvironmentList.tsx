import React from 'react'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { ListEnvironment, Project } from '@/types/projects'
import clsx from 'clsx'
import EnvironmentListToolbar from './EnvironmentListToolbar'
import { QueryClient } from '@tanstack/react-query'
import CreateEnvironmentDialog from './CreateEnvironmentDialog'
import { useToast } from '../ui/use-toast'
import { SingleListEnvironment } from './SingleListEnvironment'

interface Props {
  queryClient: QueryClient
  //
  workspaceId: string
  projectName: string

  //
  values: ListEnvironment[]
}

export const EnvironmentList: React.FC<Props> = ({
  queryClient,
  workspaceId,
  projectName,
  values,
}) => {
  const { toast } = useToast()

  const handleNewEnvironment = (name: string) => {
    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      queryClient.setQueryData(['project', workspaceId, projectName], {
        ...data,
        environments: [{ name, secretsCount: 0 }, ...data?.environments],
      })
    }

    toast({
      title: 'Environment has been created',
      variant: 'success',
    })
  }

  if (!values?.length) {
    return (
      <div className="flex items-center justify-center mt-36">
        <div className="flex flex-col items-center gap-2">
          <div>
            <Icons.inbox className="h-20 w-20 opacity-30" />
          </div>
          <div className="text-center">
            <span className="text-lg font-bold opacity-85">No environments here...</span>
            <div className="my-1">Add environments to your project</div>
            <div className="mt-5">
              <CreateEnvironmentDialog
                workspaceId={workspaceId}
                projectName={projectName}
                onSuccess={handleNewEnvironment}
                btnText="Add environment"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <EnvironmentListToolbar
        workspaceId={workspaceId}
        projectName={projectName}
        environmentsCount={values.length}
        onCreated={handleNewEnvironment}
      />

      {/* List */}
      <div className="flex flex-col gap-3 mt-6">
        {values.map(({ name, secretsCount, locked }, index) => (
          <SingleListEnvironment
            key={index}
            index={index}
            link={`/workspace/${workspaceId}/projects/${projectName}/env/${name}`}
            locked={locked}
            name={name}
            secretsCount={secretsCount}
          />
        ))}
      </div>
    </>
  )
}
