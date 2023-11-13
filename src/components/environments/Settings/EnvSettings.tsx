'use client'

import { Icons } from '@/components/icons'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import RenameEnvironmentDialog from '../RenameEnvironmentDialog'
import { ListEnvironment } from '@/types/projects'
import { Secret } from '@/types/secrets'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import DeleteEnvironmentDialog from '../DeleteEnvironmentDialog'
import LockEnvDialog from '../LockEnvDialog'
import ChangeEnvironmentTypeDialog from '../ChangeEnvironmentTypeDialog'
import EnvTypeBadge from '../EnvTypeBadge'
import { Environment, EnvironmentType } from '@/types/environments'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Skeleton } from '@/components/ui/skeleton'
import SettingsList from '@/components/SettingsList'
import DangerZone from '@/components/DangerZone'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

dayjs.extend(relativeTime)

export const EnvSettings = () => {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    data: selectedEnv,
    update: updateSelectedEnv,
    isOwnerRole: isProjectOwner,
  } = useSelectedEnvironmentStore()

  const [dialog, setDialog] = useState<'rename' | 'delete' | 'lock' | 'changeType' | null>(null)

  const handleRenamedEnv = (newName: string) => {
    setDialog(null)

    // update cache cache
    // TODO: update single item (check if env exists)

    // update list
    const queryKey = [selectedEnv?.workspaceId, selectedEnv?.projectName, 'environments']
    const envListData = queryClient.getQueryData<ListEnvironment[]>(queryKey)

    if (envListData) {
      const environments = [...envListData]
      const prevName = selectedEnv?.name

      const updatedEnvIndex = environments?.findIndex((e) => e.name === prevName)

      if (updatedEnvIndex !== -1) {
        const updated = environments?.[updatedEnvIndex]
        environments[updatedEnvIndex] = { ...updated, name: newName }
        queryClient.setQueryData(queryKey, environments)
      }
    }

    // const projectData = queryClient.getQueryData<Project>([
    //   'project',
    //   selectedEnv?.workspaceId,
    //   selectedEnv?.projectName,
    // ])
    //
    // if (projectData) {
    //   const environments = [...projectData?.environments]
    //   const prevName = selectedEnv?.name
    //
    //   const updatedEnvIndex = environments?.findIndex((e) => e.name === prevName)
    //
    //   if (updatedEnvIndex !== -1) {
    //     const updated = environments?.[updatedEnvIndex]
    //     environments[updatedEnvIndex] = { ...updated, name: newName }
    //
    //     queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
    //       ...projectData,
    //       environments,
    //     })
    //   }
    // }

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

    const key = [selectedEnv?.workspaceId, selectedEnv?.projectName, 'environments']
    const data = queryClient.getQueryData<ListEnvironment[]>(key)

    if (data) {
      const environments = [...data]
      const updatedEnvironments = environments?.filter((val) => val?.name !== selectedEnv?.name)
      queryClient.setQueryData(key, updatedEnvironments)
    }

    const singleEnvKey = [selectedEnv?.workspaceId, selectedEnv?.projectName, selectedEnv?.name]
    const singleEnvData = queryClient.getQueryData<Environment>(singleEnvKey)

    if (singleEnvData) {
      queryClient.setQueryData(singleEnvKey, null)
    }

    // TODO: update single item (check if env exists)
    // const projectData = queryClient.getQueryData<Project>([
    //   'project',
    //   selectedEnv?.workspaceId,
    //   selectedEnv?.projectName,
    // ])
    //
    // if (projectData) {
    //   const environments = projectData?.environments
    //   const updatedEnvironments = environments?.filter((val) => val?.name !== selectedEnv?.name)
    //
    //   queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
    //     ...projectData,
    //     environments: updatedEnvironments,
    //   })
    // }
    //
    toast({
      title: 'Environment has been deleted',
      variant: 'success',
    })

    router.push(`/workspace/${selectedEnv?.workspaceId}/projects/${selectedEnv?.projectName}`)
  }

  const handleLockChange = (locked: boolean) => {
    setDialog(null)

    const envListData = queryClient.getQueryData<ListEnvironment[]>([
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
      'environments',
    ])

    if (envListData) {
      const environments = [...envListData]
      const prevName = selectedEnv?.name

      const updatedEnvIndex = environments?.findIndex((e) => e.name === prevName)

      if (updatedEnvIndex !== -1) {
        const updated = environments?.[updatedEnvIndex]

        environments[updatedEnvIndex] = { ...updated, locked }

        queryClient.setQueryData(
          [selectedEnv?.workspaceId, selectedEnv?.projectName, 'environments'],
          environments
        )
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

    const envListData = queryClient.getQueryData<ListEnvironment[]>([
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
      'environments',
    ])

    if (envListData) {
      const updatedEnvList = [...envListData]
      const name = selectedEnv?.name

      const updatedEnvIndex = updatedEnvList?.findIndex((e) => e.name === name)

      if (updatedEnvIndex !== -1) {
        const updated = updatedEnvList?.[updatedEnvIndex]
        updatedEnvList[updatedEnvIndex] = { ...updated, type }

        queryClient.setQueryData(
          [selectedEnv?.workspaceId, selectedEnv?.projectName, 'environments'],
          updatedEnvList
        )
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
      {selectedEnv && isProjectOwner() && (
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

      <div className="flex flex-col gap-7">
        <SettingsList
          title="General settings"
          description={'Edit this environment'}
          icon={Icons.settings2}
          items={[
            {
              icon: Icons.clock4,
              label: 'Created at',
              component: (
                <>
                  {dayjs(selectedEnv?.createdAt).format('YYYY-MM-DD HH:mm')} (
                  {dayjs(selectedEnv?.createdAt).fromNow()})
                </>
              ),
            },
            // {
            //   icon: Icons.user,
            //   label: 'Created by',
            //   value: selectedEnv?.createdBy?.name ?? '---',
            // },

            {
              icon: Icons.user,
              label: 'Created by',
              value: !selectedEnv.createdBy ? '---' : undefined,
              component: selectedEnv?.createdBy && (
                <div className="flex items-center gap-2 md:gap-3">
                  {selectedEnv?.createdBy?.avatarUrl && (
                    <Avatar className="w-7 h-7 opacity-90">
                      <AvatarImage src={selectedEnv?.createdBy?.avatarUrl} />
                      <AvatarFallback className="bg-transparent border-2 text-sm">
                        {selectedEnv?.createdBy?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span>{selectedEnv?.createdBy?.name}</span>
                </div>
              ),
            },
            {
              icon: Icons.fileText,
              label: 'Name',
              editBtn: isProjectOwner()
                ? {
                    disabled: selectedEnv?.locked,
                    onClick: () => setDialog('rename'),
                  }
                : undefined,
              component: <div className="flex items-center gap-2">{selectedEnv?.name ?? ''}</div>,
            },
            // {
            //   icon: Icons.penSquare,
            //   label: 'Description',
            //   editBtn: {
            //     disabled: selectedEnv?.locked,
            //     onClick: () => setDialog('rename'),
            //   },
            //   component: <div className="flex items-center gap-2">{selectedEnv?.description ?? ''}</div>,
            // },
            {
              icon: Icons.tag,
              label: 'Type',
              editBtn: isProjectOwner()
                ? {
                    disabled: selectedEnv?.locked,
                    onClick: () => setDialog('changeType'),
                  }
                : undefined,
              component: <EnvTypeBadge type={selectedEnv?.type ?? EnvironmentType.STAGING} />,
            },
            {
              icon: Icons.fileLock2,
              label: 'Lock status',
              editBtn: isProjectOwner()
                ? {
                    onClick: () => setDialog('lock'),
                  }
                : undefined,
              component: (
                <div className="flex items-center gap-2">
                  <span>{selectedEnv?.locked ? 'Locked' : 'Unlocked'}</span>
                  {selectedEnv?.locked ? (
                    <Icons.lock className="h-4 w-4 -mt-[1.5px]" />
                  ) : (
                    <Icons.unlock className="h-4 w-4 -mt-[1.5px]" />
                  )}
                </div>
              ),
            },
          ]}
        />
        {/* <div className="mt-2 gap-2 rounded-md border-2"> */}
        {/*   <div className="px-0 py-3 md:px-0 lg:px-0 md:py-4"> */}
        {/*     <div className="flex items-center justify-start gap-3 px-3 md:px-6 lg:px-6"> */}
        {/*       <TypographyH4>General settings</TypographyH4> */}
        {/*       <Icons.settings2 className="h-5 w-5 opacity-80" /> */}
        {/*     </div> */}
        {/*     <div className="text-[0.95rem] text-muted-foreground mt-2 md:mt-0 px-3 md:px-6 lg:px-6"> */}
        {/*       Modify/edit this environment */}
        {/*     </div> */}
        {/**/}
        {/*     <div className="mt-7 flex flex-col gap-2.5 text-[0.97rem] ox-0"> */}
        {/*       {generalItems.map(({ label, icon: Icon }, index) => ( */}
        {/*         <> */}
        {/*           <div className="flex flex-col md:flex-row md:items-center gap-2 text-md md:justify-between px-4 md:px-10 md:h-8"> */}
        {/*             <div className="flex items-center gap-2 md:gap-3"> */}
        {/*               <Icon className="h-4 w-4 opacity-80" /> */}
        {/*               <span className="font-semibold text-[1.00rem]">{label}</span> */}
        {/*             </div> */}
        {/*             <div> */}
        {/*               {label === 'Created at' && ( */}
        {/*                 <span> */}
        {/*                   {dayjs(selectedEnv?.createdAt).format('YYYY-MM-DD HH:mm')} ( */}
        {/*                   {dayjs(selectedEnv?.createdAt).fromNow()}) */}
        {/*                 </span> */}
        {/*               )} */}
        {/*               {label === 'Created by' && <span>@dimak00</span>} */}
        {/*               {label === 'Name' && ( */}
        {/*                 <div className="flex justify-between md:justify-start items-center gap-3 md:gap-6"> */}
        {/*                   <div className="flex items-center gap-2">{selectedEnv?.name ?? ''}</div> */}
        {/*                   <Button */}
        {/*                     size={'sm'} */}
        {/*                     variant={'outline'} */}
        {/*                     disabled={selectedEnv?.locked} */}
        {/*                     onClick={() => setDialog('rename')} */}
        {/*                   > */}
        {/*                     <Icons.pencil className="h-3.5 w-3.5" /> */}
        {/*                   </Button> */}
        {/*                 </div> */}
        {/*               )} */}
        {/*               {label === 'Type' && ( */}
        {/*                 <div className="flex justify-between md:justify-start items-center gap-3 md:gap-6"> */}
        {/*                   <div className="flex items-center gap-2"> */}
        {/*                     <EnvTypeBadge type={selectedEnv?.type ?? EnvironmentType.STAGING} /> */}
        {/*                   </div> */}
        {/*                   <Button */}
        {/*                     size={'sm'} */}
        {/*                     variant={'outline'} */}
        {/*                     disabled={selectedEnv?.locked} */}
        {/*                     onClick={() => setDialog('changeType')} */}
        {/*                   > */}
        {/*                     <Icons.pencil className="h-3.5 w-3.5" /> */}
        {/*                   </Button> */}
        {/*                 </div> */}
        {/*               )} */}
        {/*               {label === 'Lock status' && ( */}
        {/*                 <div className="flex justify-between md:justify-start items-center gap-3 md:gap-6"> */}
        {/*                   <div className="flex items-center gap-2"> */}
        {/*                     <span>{selectedEnv?.locked ? 'Locked' : 'Unlocked'}</span> */}
        {/*                     {selectedEnv?.locked ? ( */}
        {/*                       <Icons.lock className="h-4 w-4" /> */}
        {/*                     ) : ( */}
        {/*                       <Icons.unlock className="h-4 w-4" /> */}
        {/*                     )} */}
        {/*                   </div> */}
        {/*                   <Button size={'sm'} variant={'outline'} onClick={() => setDialog('lock')}> */}
        {/*                     <Icons.pencil className="h-3.5 w-3.5" /> */}
        {/*                   </Button> */}
        {/*                 </div> */}
        {/*               )} */}
        {/*             </div> */}
        {/*           </div> */}
        {/*           {index !== generalItems.length - 1 && <Separator />} */}
        {/*         </> */}
        {/*       ))} */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
        {/* // DANGER ZONE */}

        {isProjectOwner() && (
          <DangerZone
            btn={{
              onClick: () => setDialog('delete'),
              disabled: selectedEnv?.locked,
            }}
            title="Delete environment"
            description="Permanently delete this environment, cannto be undone"
          />
        )}
      </div>
    </>
  )
}
