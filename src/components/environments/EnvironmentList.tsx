import React from 'react'
import { useImmer } from 'use-immer'
import { Icons } from '../icons'
import { ListEnvironment, Project } from '@/types/projects'
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
import { useEnvironmentListStore } from '@/stores/environments'
import EnvTypeBadge from './EnvTypeBadge'

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

  const { setEnvironments, groupBy, setGroupedEnvironments, isGroupedEmpty } =
    useEnvironmentListStore()

  // index of env
  const [dialog, setDialog] = useImmer<{
    type?: 'lock' | 'rename' | 'changeType' | 'delete'
    envType?: EnvironmentType
    environmentName: string
    lock?: boolean
  } | null>(null)

  const handleNewEnvironment = (args: { name: string; type: EnvironmentType }) => {
    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      const { type, name } = args
      queryClient.setQueryData(['project', workspaceId, projectName], {
        ...data,
        environments: [{ name, type, locked: false, secretsCount: 0 }, ...data?.environments],
      })
    }

    toast({
      title: 'Environment has been created',
      variant: 'success',
    })
  }

  const handleLockedEnvironment = (name: string, locked: boolean) => {
    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      const newEnvironments = [...data?.environments]
      const env = newEnvironments?.find((e) => e.name === name)

      if (env) {
        const envIndex = newEnvironments?.findIndex((e) => e.name === name)
        newEnvironments[envIndex] = { ...env, locked }

        queryClient.setQueryData(['project', workspaceId, projectName], {
          ...data,
          environments: newEnvironments,
        })

        updateState(newEnvironments)
      }
    }

    toast({
      title: locked ? 'Environment has been locked' : 'Environment has been unlocked',
      variant: 'success',
    })
  }

  const handleRenamedEnvironment = (args: { name: string; newName: string }) => {
    const { name, newName } = args

    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      const environments = [...data?.environments]
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

  const handleUpdatedEnvType = (args: { name: string; newType: EnvironmentType }) => {
    const { name, newType } = args

    const data = queryClient.getQueryData<Project>(['project', workspaceId, projectName])

    if (data) {
      const environments = [...data?.environments]
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

  if ((!values?.length && !groupedEnvironments) || (groupedEnvironments && isGroupedEmpty())) {
    return (
      <div className="flex items-center justify-center mt-32">
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
            lock={dialog?.lock !== undefined ? dialog?.lock : true}
            opened={dialog?.type === 'lock'}
            onSuccess={() => {
              handleLockedEnvironment(
                dialog?.environmentName,
                dialog?.lock !== undefined ? dialog?.lock : true
              )
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
        <div className="mt-4 flex flex-col gap-3 px-6 lg:px-10">
          {Object.entries(groupedEnvironments).map(([group, environments]) => (
            <div className="flex flex-col gap-2">
              <div>
                {group !== 'Unlocked' &&
                group !== 'Locked' &&
                group !== 'true' &&
                group !== 'false' ? (
                  <EnvTypeBadge type={group as EnvironmentType} className="text-[0.9rem]" />
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
                      setDialog({ type: 'lock', lock: !locked, environmentName: name })
                    }}
                    onRename={() => {
                      setDialog({ type: 'rename', environmentName: name })
                    }}
                    onDelete={() => {
                      setDialog({ type: 'delete', environmentName: name })
                    }}
                    onChangeType={() => {
                      setDialog({ type: 'changeType', envType: type, environmentName: name })
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2.5 mt-4 px-6 lg:px-10">
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
              setDialog({ type: 'lock', lock: !locked, environmentName: name })
            }}
            onRename={() => {
              setDialog({ type: 'rename', environmentName: name })
            }}
            onDelete={() => {
              setDialog({ type: 'delete', environmentName: name })
            }}
            onChangeType={() => {
              setDialog({ type: 'changeType', envType: type, environmentName: name })
            }}
          />
        ))}
      </div>
    </>
  )
}
