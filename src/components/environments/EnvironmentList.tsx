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
import DeleteEnvironmentDialog from './DeleteEnvironmentDialog'
import { EnvironmentType } from '@/types/environments'
import ChangeEnvironmentTypeDialog from './ChangeEnvironmentTypeDialog'
import { Badge } from '../ui/badge'
import { useEnvironmentListStore } from '@/stores/environments'

interface Props {
  queryClient: QueryClient
  //
  workspaceId: string
  projectName: string

  //
  values: ListEnvironment[]
  groupedEnvironments?: { [key: string]: ListEnvironment[] } | null
}

export const EnvironmentList: React.FC<Props> = ({
  queryClient,
  workspaceId,
  projectName,
  values,
  groupedEnvironments,
}) => {
  const { toast } = useToast()

  const { setEnvironments, groupBy, setGroupedEnvironments } = useEnvironmentListStore()

  // index of env
  const [dialog, setDialog] = useImmer<{
    type?: 'lock' | 'rename' | 'changeType' | 'delete'
    envType?: EnvironmentType
    environmentName: string
    lock?: boolean
    index: number
  } | null>(null)

  const handleNewEnvironment = (args: { name: string; type: EnvironmentType }) => {
    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      const { type, name } = args
      queryClient.setQueryData(['project', workspaceId, projectName], {
        ...data,
        environments: [{ name, type, secretsCount: 0 }, ...data?.environments],
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
      const newEnvironments = data?.environments.map((env, i) =>
        i === index ? { ...env, locked: !env.locked } : env
      )

      queryClient.setQueryData(['project', workspaceId, projectName], {
        ...data,
        environments: newEnvironments,
      })

      updateState(newEnvironments)
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
        // environments[envIndex].name = newName
        environments[envIndex] = { ...environments[envIndex], name: newName }

        queryClient.setQueryData(['project', workspaceId, projectName], {
          ...data,
          environments,
        })

        updateState(environments)
      }
    }

    toast({
      title: 'Environment has been renamed',
      variant: 'success',
    })
  }

  const handleUpdatedEnvType = (args: {
    index: number
    name: string
    newType: EnvironmentType
  }) => {
    const { index, name, newType } = args

    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      const environments = data?.environments
      const env = environments?.find((e) => e.name === name)

      if (env) {
        const envIndex = environments?.findIndex((e) => e.name === name)
        // environments[envIndex].type = newType
        environments[envIndex] = { ...environments[envIndex], type: newType }

        const newData = {
          ...data,
          environments,
        }

        queryClient.setQueryData(['project', workspaceId, projectName], newData)

        updateState(environments)
      }
    }

    toast({
      title: 'Environment type has been changed',
      variant: 'success',
    })
  }

  const handleDeletedEnv = (envName: string) => {
    const projectData = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    // update secrets data ???
    if (projectData) {
      const environments = projectData?.environments
      const updatedEnvironments = environments?.filter((val) => val?.name !== envName)

      queryClient.setQueryData(['project', workspaceId, projectName], {
        ...projectData,
        environments: updatedEnvironments,
      })

      updateState(updatedEnvironments)
    }

    toast({
      title: 'Environment has been delete',
      variant: 'success',
    })
  }

  // TODO:
  const updateState = (envArr: ListEnvironment[]) => {
    if (!groupBy) {
      setEnvironments(envArr)
    } else {
      setGroupedEnvironments(envArr)
    }
  }

  if (!values?.length && !groupedEnvironments) {
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
        environmentsCount={
          !groupedEnvironments
            ? values.length
            : Object.values(groupedEnvironments).reduce(
                (accumulator, currentArray) => accumulator + currentArray.length,
                0
              )
        }
        onCreated={handleNewEnvironment}
      />

      {dialog && (
        <>
          <LockEnvDialog
            envName={dialog?.environmentName}
            projectName={projectName}
            workspaceId={workspaceId}
            lock={dialog?.lock ?? true}
            opened={dialog?.type === 'lock'}
            onSuccess={() => {
              handleLockedEnvironment(dialog?.index, dialog?.lock ?? true)
              handleCloseDialog()
            }}
            onClose={handleCloseDialog}
          />

          <RenameEnvironmentDialog
            envName={dialog?.environmentName}
            projectName={projectName}
            workspaceId={workspaceId}
            opened={dialog?.type === 'rename'}
            onSuccess={(newName) => {
              handleRenamedEnvironment({
                index: dialog?.index,
                name: dialog?.environmentName,
                newName,
              })
              handleCloseDialog()
            }}
            onClose={handleCloseDialog}
          />

          {dialog?.envType && (
            <ChangeEnvironmentTypeDialog
              envName={dialog?.environmentName}
              projectName={projectName}
              workspaceId={workspaceId}
              type={dialog?.envType}
              opened={dialog?.type === 'changeType'}
              onSuccess={(newType) => {
                handleUpdatedEnvType({
                  index: dialog?.index,
                  name: dialog?.environmentName,
                  newType,
                })
                handleCloseDialog()
              }}
              onClose={handleCloseDialog}
            />
          )}

          <DeleteEnvironmentDialog
            envName={dialog?.environmentName ?? ''}
            projectName={projectName}
            workspaceId={workspaceId}
            opened={dialog?.type === 'delete'}
            onClose={handleCloseDialog}
            onSuccess={() => {
              handleDeletedEnv(dialog?.environmentName)
              handleCloseDialog()
              //
            }}
          />
        </>
      )}

      {/* List */}
      {groupedEnvironments && (
        <div className="mt-4 flex flex-col gap-3">
          {Object.entries(groupedEnvironments).map(([group, environments]) => (
            <div className="flex flex-col gap-2">
              <div>
                {group !== 'Unlocked' &&
                group !== 'Locked' &&
                group !== 'true' &&
                group !== 'false' ? (
                  <Badge
                    variant="default"
                    className={clsx(['text-[0.9rem] text-gray-200'], {
                      'bg-indigo-600 dark:bg-indigo-800/80 hover:bg-indigo-600 dark:hover:bg-indigo-800/80':
                        group === EnvironmentType.DEVELOPMENT,
                      'bg-blue-600 dark:bg-blue-800/80 hover:bg-blue-600 dark:hover:bg-blue-800/80':
                        group === EnvironmentType.TESTING,
                      'bg-green-600 dark:bg-green-800/80 hover:bg-green-600 dark:hover:bg-green-800/80':
                        group === EnvironmentType.STAGING,
                      'bg-red-600 dark:bg-red-800/80 hover:bg-red-600 dark:hover:bg-red-800/80':
                        group === EnvironmentType.PRODUCTION,
                    })}
                  >
                    {group === EnvironmentType.DEVELOPMENT && 'Development'}
                    {group === EnvironmentType.TESTING && 'Testing'}
                    {group === EnvironmentType.STAGING && 'Staging'}
                    {group === EnvironmentType.PRODUCTION && 'Production'}
                  </Badge>
                ) : (
                  <div className="px-1 flex items-center gap-2 font-bold text-[1.125rem]">
                    {(group === 'Locked' || group === 'true') && (
                      <>
                        <Icons.lock className="h-4 w-4" />
                        Locked
                      </>
                    )}
                    {(group === 'Unlocked' || group === 'false') && (
                      <>
                        <Icons.unlock className="h-4 w-4" />
                        Unlocked
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2.5 mt-2 mb-6">
                {environments.map(({ name, type, locked, secretsCount }, index) => (
                  <SingleListEnvironment
                    key={index}
                    index={index}
                    link={`/workspace/${workspaceId}/projects/${projectName}/env/${name}`}
                    locked={locked}
                    type={type}
                    name={name}
                    secretsCount={secretsCount}
                    onLock={() => {
                      setDialog({ type: 'lock', lock: !locked, index, environmentName: name })
                    }}
                    onRename={() => {
                      setDialog({ type: 'rename', index, environmentName: name })
                    }}
                    onDelete={() => {
                      setDialog({ type: 'delete', index, environmentName: name })
                    }}
                    onChangeType={() => {
                      setDialog({ type: 'changeType', envType: type, index, environmentName: name })
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2.5 mt-4">
        {values.map(({ name, type, locked, secretsCount }, index) => (
          <SingleListEnvironment
            key={index}
            index={index}
            link={`/workspace/${workspaceId}/projects/${projectName}/env/${name}`}
            locked={locked}
            type={type}
            name={name}
            secretsCount={secretsCount}
            onLock={() => {
              setDialog({ type: 'lock', lock: !locked, index, environmentName: name })
            }}
            onRename={() => {
              setDialog({ type: 'rename', index, environmentName: name })
            }}
            onDelete={() => {
              setDialog({ type: 'delete', index, environmentName: name })
            }}
            onChangeType={() => {
              setDialog({ type: 'changeType', envType: type, index, environmentName: name })
            }}
          />
        ))}
      </div>
    </>
  )
}
