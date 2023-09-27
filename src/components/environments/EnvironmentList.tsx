import React, { useState } from 'react'
import { useImmer } from 'use-immer'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { ListEnvironment, Project } from '@/types/projects'
import clsx from 'clsx'
import EnvironmentListToolbar from './EnvironmentListToolbar'
import { QueryClient } from '@tanstack/react-query'
import CreateEnvironmentDialog from './CreateEnvironmentDialog'
import { useToast } from '../ui/use-toast'
import SingleListEnvironment from './SingleListEnvironment'
import LockEnvDialog from './LockEnvDialog'
import RenameEnvironmentDialog from './RenameEnvironmentDialog'

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
  // index of env
  const [dialog, setDialog] = useImmer<{
    type?: 'lock' | 'rename' | 'delete'
    environmentName: string
    lock?: boolean
    index: number
  } | null>(null)

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

  const handleLockedEnvironment = (index: number, locked: boolean) => {
    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      queryClient.setQueryData(['project', workspaceId, projectName], {
        ...data,
        environments: data?.environments.map((env, i) =>
          i === index ? { ...env, locked: !env.locked } : env
        ),
      })
    }

    toast({
      title: locked ? 'Environment has been locked' : 'Environment has been unlocked',
      variant: 'success',
    })
  }

  const handleRenamedEnvironment = (args: { index: number; name: string; newName: string }) => {
    const { index, name, newName } = args

    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      const environments = data?.environments
      const env = environments?.find((e) => e.name === name)

      if (env) {
        const envIndex = environments?.findIndex((e) => e.name === name)
        environments[envIndex].name = newName

        queryClient.setQueryData(['project', workspaceId, projectName], {
          ...data,
          environments,
        })
      }
    }

    toast({
      title: 'Environment has been renamed',
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

  const handleCloseDialog = () => {
    setDialog((draft) => {
      if (draft) {
        draft.type = undefined
      }
    })

    setTimeout(() => {
      setDialog(null)
    }, 300)
  }

  return (
    <>
      <EnvironmentListToolbar
        workspaceId={workspaceId}
        projectName={projectName}
        environmentsCount={values.length}
        onCreated={handleNewEnvironment}
      />

      <LockEnvDialog
        envName={dialog?.environmentName ?? ''}
        projectName={projectName}
        workspaceId={workspaceId}
        lock={dialog?.lock ?? true}
        opened={dialog?.type === 'lock'}
        onSuccess={() => {
          handleLockedEnvironment(dialog?.index ?? -1, dialog?.lock ?? true)
          handleCloseDialog()
        }}
        onClose={handleCloseDialog}
      />

      <RenameEnvironmentDialog
        envName={dialog?.environmentName ?? ''}
        projectName={projectName}
        workspaceId={workspaceId}
        opened={dialog?.type === 'rename'}
        onSuccess={(newName) => {
          handleRenamedEnvironment({
            index: dialog?.index ?? -1,
            name: dialog?.environmentName ?? '',
            newName,
          })
          handleCloseDialog()
        }}
        onClose={handleCloseDialog}
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
            onLock={() => {
              setDialog({ type: 'lock', lock: !locked, index, environmentName: name })
            }}
            onRename={() => {
              setDialog({ type: 'rename', lock: locked, index, environmentName: name })
            }}
          />
        ))}
      </div>
    </>
  )
}
