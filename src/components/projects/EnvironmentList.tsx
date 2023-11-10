'use client'

import { useGetEnvironments } from '@/api/queries/projects/environments/environments'
import SingleListEnvironment from '../environments/SingleListEnvironment'
import EnvironmentListToolbar from '../environments/EnvironmentListToolbar'
import { useEnvironmentListStore } from '@/stores/environments'
import { EnvironmentType } from '@/types/environments'
import { useImmer } from 'use-immer'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import { ListEnvironment } from '@/types/projects'
import { Icons } from '../icons'
import CreateEnvironmentDialog from '../environments/CreateEnvironmentDialog'
import { EnvironmentListSkeleton } from './ProjectSkeleton'
import EnvTypeBadge from '../environments/EnvTypeBadge'
import LockEnvDialog from '../environments/LockEnvDialog'
import RenameEnvironmentDialog from '../environments/RenameEnvironmentDialog'
import ChangeEnvironmentTypeDialog from '../environments/ChangeEnvironmentTypeDialog'
import DeleteEnvironmentDialog from '../environments/DeleteEnvironmentDialog'
import { useMount, useUnmount, useUpdateEffect } from 'react-use'
import NotFound from './NotFound'
import Error from '../Error'
import { useSelectedProjectStore } from '@/stores/selectedProject'

interface Props {
  workspaceId: string
  projectName: string
}

const EnvironmentList: React.FC<Props> = ({ projectName, workspaceId }) => {
  const { data: selectedProject } = useSelectedProjectStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    environments,
    setEnvironments,
    groupedEnvironments,
    groupBy,
    setGroupedEnvironments,
    isGroupedEmpty,
  } = useEnvironmentListStore()

  const getQueryKey = (): string[] => {
    return [workspaceId, projectName, 'environments']
  }

  const { data, isLoading, error } = useGetEnvironments({
    workspaceId,
    projectName,
  })

  useUpdateEffect(() => {
    if (data) {
      if (!groupBy) {
        setEnvironments(data)
      } else {
        setGroupedEnvironments(data)
      }
    }
  }, [data])

  useMount(() => {
    if (data) {
      if (!groupBy) {
        setEnvironments(data)
      } else {
        setGroupedEnvironments(data)
      }
    }
  })

  useUnmount(() => {
    setEnvironments([])
    setGroupedEnvironments(null)
  })

  // index of env
  const [dialog, setDialog] = useImmer<{
    type?: 'lock' | 'rename' | 'changeType' | 'delete'
    envType?: EnvironmentType
    environmentName: string
    lock?: boolean
  } | null>(null)

  const handleNewEnvironment = (args: { name: string; type: EnvironmentType }) => {
    const key = getQueryKey()
    const data = queryClient.getQueryData<ListEnvironment[]>(key)

    if (data) {
      const { type, name } = args
      queryClient.setQueryData(key, [{ name, type, locked: false, secretsCount: 0 }, ...data])
    }

    toast({
      title: 'Environment has been created',
      variant: 'success',
    })
  }

  const handleLockedEnvironment = (name: string, locked: boolean) => {
    const key = getQueryKey()
    const data = queryClient.getQueryData<ListEnvironment[]>(key)
    //
    if (data) {
      const newEnvironments = [...data]
      const env = newEnvironments?.find((e) => e.name === name)

      if (env) {
        const envIndex = newEnvironments?.findIndex((e) => e.name === name)
        newEnvironments[envIndex] = { ...env, locked }

        queryClient.setQueryData(key, newEnvironments)

        updateState(newEnvironments)
      }
    }

    toast({
      title: locked ? 'Environment has been locked' : 'Environment has been unlocked',
      variant: 'success',
    })
  }

  const handleRenamedEnvironment = (args: { name: string; newName: string }) => {
    const key = getQueryKey()
    const { name, newName } = args

    const data = queryClient.getQueryData<ListEnvironment[]>(key)

    if (data) {
      const environments = [...data]
      const env = environments?.find((e) => e.name === name)

      if (env) {
        const envIndex = environments?.findIndex((e) => e.name === name)
        // environments[envIndex].name = newName
        environments[envIndex] = { ...environments[envIndex], name: newName }

        queryClient.setQueryData(key, environments)

        updateState(environments)
      }
    }

    toast({
      title: 'Environment has been renamed',
      variant: 'success',
    })
  }

  const handleUpdatedEnvType = (args: { name: string; newType: EnvironmentType }) => {
    const key = getQueryKey()
    const { name, newType } = args

    const data = queryClient.getQueryData<ListEnvironment[]>(key)

    if (data) {
      const environments = [...data]
      const env = environments?.find((e) => e.name === name)

      if (env) {
        const envIndex = environments?.findIndex((e) => e.name === name)
        // environments[envIndex].type = newType
        environments[envIndex] = { ...environments[envIndex], type: newType }

        queryClient.setQueryData(key, environments)

        updateState(environments)
      }
    }

    toast({
      title: 'Environment type has been changed',
      variant: 'success',
    })
  }

  const handleDeletedEnv = (envName: string) => {
    const key = getQueryKey()
    const environments = queryClient.getQueryData<ListEnvironment[]>(key)

    // update secrets data ???
    if (environments) {
      const updatedEnvironments = environments?.filter((val) => val?.name !== envName)

      queryClient.setQueryData(key, updatedEnvironments)
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

  if (isLoading || !environments) {
    return (
      <div className="mt-5 px-6 lg:px-10">
        <EnvironmentListSkeleton grouped={groupBy !== null ? true : false} />
      </div>
    )
  }

  if ((!data?.length && !groupedEnvironments) || (groupedEnvironments && isGroupedEmpty())) {
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

  if (error) {
    if (error?.code === 'project_not_found') {
      return (
        <NotFound
          link={`/workspace/${workspaceId}/projects`}
          title="Project not found"
          description="Looks like this project doesn't exist"
          btnText="Go to projects"
        />
      )
    } else {
      return (
        <Error
          link={{
            text: 'Go to projects',
            href: `/workspace/${workspaceId}/projects`,
          }}
        />
      )
    }
  }

  return (
    <>
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

      <div className="mt-3">
        <EnvironmentListToolbar
          workspaceId={workspaceId}
          projectName={projectName}
          environmentsCount={
            !groupedEnvironments
              ? data.length
              : Object.values(groupedEnvironments).reduce(
                  (accumulator, currentArray) => accumulator + currentArray.length,
                  0
                )
          }
          onCreated={selectedProject?.userRole === 'OWNER' ? handleNewEnvironment : undefined}
        />

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
                      disableActions={selectedProject?.userRole === 'MEMBER'}
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
          {environments.map(({ name, type, locked, secretsCount }, index) => (
            <SingleListEnvironment
              key={index}
              index={index}
              link={`/workspace/${workspaceId}/projects/${projectName}/env/${name}`}
              locked={locked}
              type={type}
              name={name}
              secretsCount={secretsCount}
              disableActions={selectedProject?.userRole === 'MEMBER'}
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
    </>
  )
}

export default EnvironmentList
