'use client'

import { Icons } from '@/components/icons'
import TypographyH4 from '@/components/typography/TypographyH4'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import RenameEnvironmentDialog from '../RenameEnvironmentDialog'
import { Project } from '@/types/projects'
import { Secret } from '@/types/secrets'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import DeleteEnvironmentDialog from '../DeleteEnvironmentDialog'
import LockEnvDialog from '../LockEnvDialog'
import ChangeEnvironmentTypeDialog from '../ChangeEnvironmentTypeDialog'
import EnvTypeBadge from '../EnvTypeBadge'
import { Environment, EnvironmentType } from '@/types/environments'
import { LucideIcon } from 'lucide-react'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Skeleton } from '@/components/ui/skeleton'

dayjs.extend(relativeTime)

const generalItems: Array<{
  label: string
  icon: LucideIcon
}> = [
  {
    icon: Icons.clock4,
    label: 'Created at',
  },
  {
    icon: Icons.user,
    label: 'Created by',
  },
  {
    icon: Icons.fileText,
    label: 'Name',
  },
  {
    icon: Icons.tag,
    label: 'Type',
  },
  {
    icon: Icons.fileLock2,
    label: 'Lock status',
  },
]

export const EnvSettings = (props: {}) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { toast } = useToast()
  const { data: selectedEnv, update: updateSelectedEnv } = useSelectedEnvironmentStore()

  const [dialog, setDialog] = useState<'rename' | 'delete' | 'lock' | 'changeType' | null>(null)

  const handleRenamedEnv = (newName: string) => {
    setDialog(null)

    // update cache cache
    // TODO: update single item (check if env exists)

    // update list
    const projectData = queryClient.getQueryData<Project>([
      'project',
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
    ])

    if (projectData) {
      const environments = [...projectData?.environments]
      const prevName = selectedEnv?.name

      const updatedEnvIndex = environments?.findIndex((e) => e.name === prevName)

      if (updatedEnvIndex !== -1) {
        const updated = environments?.[updatedEnvIndex]
        environments[updatedEnvIndex] = { ...updated, name: newName }

        queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
          ...projectData,
          environments,
        })
      }
    }

    // updated secrets under new name
    const secretsData = queryClient.getQueryData<Secret[]>([
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
      selectedEnv?.name,
      'secrets',
    ])

    if (secretsData) {
      queryClient.setQueryData(
        [selectedEnv?.workspaceId, selectedEnv?.projectName, newName, 'secrets'],
        secretsData
      )
      // queryClient.invalidateQueries([
      //   selectedEnv?.workspaceId,
      //   selectedEnv?.projectName,
      //   selectedEnv?.envName,
      //   'secrets',
      // ])
    }

    router.push(
      `/workspace/${selectedEnv?.workspaceId}/projects/${selectedEnv?.projectName}/env/${newName}/settings`
    )
  }

  const handleDeletedEnv = () => {
    setDialog(null)

    // update cache
    // TODO: update single item (check if env exists)
    const projectData = queryClient.getQueryData<Project>([
      'project',
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
    ])

    if (projectData) {
      const environments = projectData?.environments
      const updatedEnvironments = environments?.filter((val) => val?.name !== selectedEnv?.name)

      queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
        ...projectData,
        environments: updatedEnvironments,
      })
    }

    toast({
      title: 'Environment has been deleted',
      variant: 'success',
    })

    router.push(`/workspace/${selectedEnv?.workspaceId}/projects/${selectedEnv?.projectName}`)
  }

  const handleLockChange = (locked: boolean) => {
    setDialog(null)

    const projectData = queryClient.getQueryData<Project>([
      'project',
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
    ])

    if (projectData) {
      const environments = [...projectData?.environments]
      const prevName = selectedEnv?.name

      const updatedEnvIndex = environments?.findIndex((e) => e.name === prevName)

      if (updatedEnvIndex !== -1) {
        const updated = environments?.[updatedEnvIndex]

        environments[updatedEnvIndex] = { ...updated, locked }

        queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
          ...projectData,
          environments,
        })
      }
    }

    const environmentData = queryClient.getQueryData<Environment>([
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
      selectedEnv?.name,
    ])

    if (environmentData) {
      queryClient.setQueryData(
        [selectedEnv?.workspaceId, selectedEnv?.projectName, selectedEnv?.name],
        {
          ...environmentData,
          locked,
        }
      )
    }

    updateSelectedEnv({ locked })

    toast({
      title: `Environment has been ${locked ? 'locked' : 'unlocked'}`,
      variant: 'success',
    })
  }

  const handleTypeChange = (type: EnvironmentType) => {
    setDialog(null)

    const projectData = queryClient.getQueryData<Project>([
      'project',
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
    ])

    if (projectData) {
      const environments = [...projectData?.environments]
      const name = selectedEnv?.name

      const updatedEnvIndex = environments?.findIndex((e) => e.name === name)

      if (updatedEnvIndex !== -1) {
        const updated = environments?.[updatedEnvIndex]

        environments[updatedEnvIndex] = { ...updated, type }

        queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
          ...projectData,
          environments,
        })
      }
    }

    const environmentData = queryClient.getQueryData<Environment>([
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
      selectedEnv?.name,
    ])

    if (environmentData) {
      queryClient.setQueryData(
        [selectedEnv?.workspaceId, selectedEnv?.projectName, selectedEnv?.name],
        {
          ...environmentData,
          type,
        }
      )
    }

    toast({
      title: 'Environment type has been changed',
      variant: 'success',
    })

    updateSelectedEnv({ type })
  }

  if (!selectedEnv) {
    return <Skeleton className="mt-2 border-2 h-48 w-full" />
  }

  return (
    <>
      {selectedEnv && (
        <>
          <RenameEnvironmentDialog
            opened={dialog === 'rename'}
            workspaceId={selectedEnv.workspaceId}
            projectName={selectedEnv.projectName}
            envName={selectedEnv.name}
            onClose={() => setDialog(null)}
            onSuccess={handleRenamedEnv}
          />

          <DeleteEnvironmentDialog
            opened={dialog === 'delete'}
            workspaceId={selectedEnv.workspaceId}
            projectName={selectedEnv.projectName}
            envName={selectedEnv.name}
            onClose={() => setDialog(null)}
            onSuccess={handleDeletedEnv}
          />

          <LockEnvDialog
            opened={dialog === 'lock'}
            workspaceId={selectedEnv.workspaceId}
            projectName={selectedEnv.projectName}
            envName={selectedEnv.name}
            lock={!selectedEnv.locked}
            onClose={() => setDialog(null)}
            onSuccess={() => handleLockChange(!selectedEnv.locked)}
          />

          <ChangeEnvironmentTypeDialog
            type={selectedEnv.type}
            opened={dialog === 'changeType'}
            workspaceId={selectedEnv.workspaceId}
            projectName={selectedEnv.projectName}
            envName={selectedEnv.name}
            onClose={() => setDialog(null)}
            onSuccess={handleTypeChange}
          />
        </>
      )}

      <div>
        <div className="mt-2 gap-2 rounded-md border-2">
          <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4">
            <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6">
              <TypographyH4>General settings</TypographyH4>
              <Icons.settings2 className="h-5 w-5 opacity-80" />
            </div>
            {/* // */}
            <div className="text-[0.95rem] text-muted-foreground mt-2 md:mt-0 px-3 md:px-6 lg:px-6">
              Modify/edit this environment
            </div>

            <div className="mt-7 flex flex-col gap-2.5 text-[0.97rem] ox-0">
              {generalItems.map(({ label, icon: Icon }, index) => (
                <>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 text-md md:justify-between px-4 md:px-10 md:h-8">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Icon className="h-4 w-4 opacity-80" />
                      <span className="font-semibold text-[1.00rem]">{label}</span>
                    </div>
                    <div>
                      {label === 'Created at' && (
                        <span>
                          {dayjs(selectedEnv?.createdAt).format('YYYY-MM-DD HH:mm')} (
                          {dayjs(selectedEnv?.createdAt).fromNow()})
                        </span>
                      )}
                      {label === 'Created by' && <span>@dimak00</span>}
                      {label === 'Name' && (
                        <div className="flex justify-between md:justify-start items-center gap-3 md:gap-6">
                          <div className="flex items-center gap-2">{selectedEnv?.name ?? ''}</div>
                          <Button
                            size={'sm'}
                            variant={'outline'}
                            disabled={selectedEnv?.locked}
                            onClick={() => setDialog('rename')}
                          >
                            <Icons.pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                      {label === 'Type' && (
                        <div className="flex justify-between md:justify-start items-center gap-3 md:gap-6">
                          <div className="flex items-center gap-2">
                            <EnvTypeBadge type={selectedEnv?.type ?? EnvironmentType.STAGING} />
                          </div>
                          <Button
                            size={'sm'}
                            variant={'outline'}
                            disabled={selectedEnv?.locked}
                            onClick={() => setDialog('changeType')}
                          >
                            <Icons.pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                      {label === 'Lock status' && (
                        <div className="flex justify-between md:justify-start items-center gap-3 md:gap-6">
                          <div className="flex items-center gap-2">
                            <span>{selectedEnv?.locked ? 'Locked' : 'Unlocked'}</span>
                            {selectedEnv?.locked ? (
                              <Icons.lock className="h-4 w-4" />
                            ) : (
                              <Icons.unlock className="h-4 w-4" />
                            )}
                          </div>
                          <Button size={'sm'} variant={'outline'} onClick={() => setDialog('lock')}>
                            <Icons.pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {index !== generalItems.length - 1 && <Separator />}
                </>
              ))}
            </div>
          </div>
        </div>
        {/* // DANGER ZONE */}
        <div className="mt-7 gap-2 rounded-md border-2">
          <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4">
            <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6">
              <TypographyH4 className="text-red-600 dark:text-red-600">Danger zone</TypographyH4>
            </div>

            <div className="mt-4 flex items-center gap-2 text-md justify-between px-3 md:px-8">
              <div className="flex flex-col items-start gap-0 md:gap-0">
                <span className="font-semibold text-[1.01rem]">{`Delete environment `}</span>
                <span className="text-muted-foreground text-[0.95rem]">
                  Permanently delete this environment, cannot be undone.
                </span>
              </div>
              <div className="flex items-center gap-6">
                <Button
                  size={'sm'}
                  variant={'destructive'}
                  className="px-5"
                  disabled={selectedEnv?.locked}
                  onClick={() => setDialog('delete')}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
