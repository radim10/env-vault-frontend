'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { SecretAction, useEditedSecretsStore } from '@/stores/secrets'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import SaveConfirmDialog from './SaveConfirmDialog'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import { ListEnvironment } from '@/types/projects'
import { Secret } from '@/types/secrets'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import UndoAllChangesDialog from './UndoAllChangesDialog'
import useKeyboardJs from 'react-use/lib/useKeyboardJs'
import { useUpdateEffect } from 'react-use'

interface Props {
  showBtn: boolean
}

const SaveSecretsToolbar: React.FC<Props> = ({ showBtn }) => {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [savePressed] = useKeyboardJs('ctrl + enter')
  const [undoPressed] = useKeyboardJs('ctrl + backspace')

  const { data: selectedEnv } = useSelectedEnvironmentStore()

  const [dialog, setDialog] = useState<'save' | 'undo' | null>(null)

  useUpdateEffect(() => {
    if (savePressed) handleSaveShortcut()
  }, [savePressed])

  useUpdateEffect(() => {
    if (undoPressed) handleUndoShortcut()
  }, [undoPressed])

  const handleSaveShortcut = () => {
    if (
      selectedEnv?.secretsLoaded === true &&
      secrets?.length !== 0 &&
      !(
        secrets?.length === 0 ||
        !secrets?.filter(
          (s) =>
            s.action !== null ||
            (!s.description && s.newDescription) ||
            (s.description && s.newDescription !== s.description && s.newDescription) ||
            (s.newDescription?.length === 0 && s.description)
        )?.length
      )
    ) {
      handleOpenDialog()
    }
  }

  const handleUndoShortcut = () => {
    if (
      secrets?.filter(
        (s) =>
          s.action !== null ||
          (!s.description && s.newDescription) ||
          (s.description && s.newDescription !== s.description && s.newDescription) ||
          (s.newDescription?.length === 0 && s.description)
      ).length > 0
    ) {
      setDialog('undo')
    }
  }

  const { loaded, secrets, undoAllChanges } = useEditedSecretsStore((state) => {
    return {
      loaded: state.loaded,
      secrets: state.secrets,
      undoAllChanges: state.undoAllChanges,
    }
  })

  const getChangesText = (): string => {
    const changes = secrets?.filter(
      (s) =>
        s.action !== null ||
        (!s.description && s.newDescription) ||
        (s.description && s.newDescription !== s.description && s.newDescription) ||
        (s.newDescription && s.newDescription?.length === 0 && s.description) ||
        (s.newDescription?.length === 0 && s.description)
    )
    let text = changes?.length > 1 ? 'changes' : 'change'

    return `${changes?.length} ${text}`
  }

  const handleUpdatedSecrets = () => {
    setDialog(null)

    updateCache()
    toast({
      title: 'Secrets have been updated',
      variant: 'success',
    })
  }

  const updateCache = () => {
    const updatedSecrets = secrets
      ?.filter((val) => val?.action !== SecretAction.Deleted)
      ?.map(({ value, key, newKey, newValue, newDescription, description }) => {
        return {
          key: newKey !== undefined ? newKey : key,
          value: newValue !== undefined ? newValue : value,
          description:
            newDescription !== undefined
              ? newDescription?.length === 0
                ? undefined
                : newDescription
              : description,
        }
      })

    queryClient.setQueryData(
      [selectedEnv?.workspaceId, selectedEnv?.projectName, selectedEnv?.name, 'secrets'],
      updatedSecrets
    )
  }

  const handleOpenDialog = () => {
    const secretWithNoKey = secrets?.findIndex(
      (s) => s.key?.trim()?.length === 0 && (s.newKey?.trim()?.length === 0 || !s?.newKey)
    )

    if (secretWithNoKey !== -1) {
      toast({
        title: 'All secrets must have a key',
        variant: 'destructive',
      })

      return
    }

    const allKeys = secrets?.map((s) => {
      if (s.newKey !== undefined) {
        return s.newKey
      } else {
        return s.key
      }
    })

    const set = new Set(allKeys)

    // if (hasDuplicates(secrets, 'key')) {
    if (allKeys?.length !== set.size) {
      toast({
        title: 'All secrets must have a unique key',
        variant: 'destructive',
      })

      return
    }

    setDialog('save')
  }

  const handleRenamedEnv = (newName: string) => {
    setDialog(null)

    // update cache cache
    // TODO: update single item (check if env exists)

    // update list
    const envListData = queryClient.getQueryData<ListEnvironment[]>([
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
      'environments',
    ])

    if (envListData) {
      const updatedEnvList = [...envListData]
      const prevName = selectedEnv?.name

      const updatedEnvIndex = updatedEnvList?.findIndex((e) => e.name === prevName)

      if (updatedEnvIndex !== -1) {
        const updated = updatedEnvList?.[updatedEnvIndex]
        updatedEnvList[updatedEnvIndex] = { ...updated, name: newName }

        queryClient.setQueryData(
          [selectedEnv?.workspaceId, selectedEnv?.projectName, 'environments'],
          updatedEnvList
        )
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
      `/workspace/${selectedEnv?.workspaceId}/projects/${selectedEnv?.projectName}/env/${newName}`
    )
  }
  //
  // const handleLockChange = (locked: boolean) => {
  //   setDialog(null)
  //
  //   const projectData = queryClient.getQueryData<Project>([
  //     'project',
  //     selectedEnv?.workspaceId,
  //     selectedEnv?.projectName,
  //   ])
  //
  //   if (projectData) {
  //     const environments = [...projectData?.environments]
  //     const prevName = selectedEnv?.name
  //
  //     const updatedEnvIndex = environments?.findIndex((e) => e.name === prevName)
  //
  //     if (updatedEnvIndex !== -1) {
  //       const updated = environments?.[updatedEnvIndex]
  //
  //       environments[updatedEnvIndex] = { ...updated, locked }
  //
  //       queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
  //         ...projectData,
  //         environments,
  //       })
  //     }
  //   }
  //
  //   const environmentData = queryClient.getQueryData<Environment>([
  //     selectedEnv?.workspaceId,
  //     selectedEnv?.projectName,
  //     selectedEnv?.name,
  //   ])
  //
  //   if (environmentData) {
  //     queryClient.setQueryData(
  //       [selectedEnv?.workspaceId, selectedEnv?.projectName, selectedEnv?.name],
  //       {
  //         ...environmentData,
  //         locked,
  //       }
  //     )
  //   }
  //
  //   updateSelectedEnv({ locked })
  //
  //   toast({
  //     title: `Environment has been ${locked ? 'locked' : 'unlocked'}`,
  //     variant: 'success',
  //   })
  // }
  //
  // const handleTypeChange = (type: EnvironmentType) => {
  //   setDialog(null)
  //
  //   const projectData = queryClient.getQueryData<Project>([
  //     'project',
  //     selectedEnv?.workspaceId,
  //     selectedEnv?.projectName,
  //   ])
  //
  //   if (projectData) {
  //     const environments = [...projectData?.environments]
  //     const name = selectedEnv?.name
  //
  //     const updatedEnvIndex = environments?.findIndex((e) => e.name === name)
  //
  //     if (updatedEnvIndex !== -1) {
  //       const updated = environments?.[updatedEnvIndex]
  //
  //       environments[updatedEnvIndex] = { ...updated, type }
  //
  //       queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
  //         ...projectData,
  //         environments,
  //       })
  //     }
  //   }
  //
  //   const environmentData = queryClient.getQueryData<Environment>([
  //     selectedEnv?.workspaceId,
  //     selectedEnv?.projectName,
  //     selectedEnv?.name,
  //   ])
  //
  //   if (environmentData) {
  //     queryClient.setQueryData(
  //       [selectedEnv?.workspaceId, selectedEnv?.projectName, selectedEnv?.name],
  //       {
  //         ...environmentData,
  //         type,
  //       }
  //     )
  //   }
  //
  //   toast({
  //     title: 'Environment type has been changed',
  //     variant: 'success',
  //   })
  //
  //   updateSelectedEnv({ type })
  // }
  //
  // const handleDeletedEnv = () => {
  //   setDialog(null)
  //
  //   // update cache
  //   // TODO: update single item (check if env exists)
  //   const projectData = queryClient.getQueryData<Project>([
  //     'project',
  //     selectedEnv?.workspaceId,
  //     selectedEnv?.projectName,
  //   ])
  //
  //   if (projectData) {
  //     const environments = projectData?.environments
  //     const updatedEnvironments = environments?.filter((val) => val?.name !== selectedEnv?.name)
  //
  //     queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
  //       ...projectData,
  //       environments: updatedEnvironments,
  //     })
  //   }
  //
  //   router.push(`/workspace/${selectedEnv?.workspaceId}/projects/${selectedEnv?.projectName}`)
  // }

  const handleUndoAllSecretsChanges = () => {
    const secretsData = queryClient.getQueryData<Secret[]>([
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
      selectedEnv?.name,
      'secrets',
    ])

    if (secretsData) {
      undoAllChanges(secretsData)
    }

    setDialog(null)

    toast({
      title: 'All changes have been undone',
      variant: 'success',
    })
  }

  if (!selectedEnv) {
    return <></>
  }

  if (!showBtn) {
    return <></>
  }

  return (
    <>
      {true && (
        <SaveConfirmDialog
          opened={dialog === 'save'}
          workspaceId={selectedEnv.workspaceId}
          projectName={selectedEnv.projectName}
          envName={selectedEnv.name}
          secrets={secrets}
          onSuccess={handleUpdatedSecrets}
          onClose={() => setDialog(null)}
          changes={secrets?.filter(
            (s) =>
              s.action !== null ||
              (s.newDescription && !s.description) ||
              (s.description && s.newDescription !== s.description && s.newDescription) ||
              (s.newDescription && s.newDescription?.length === 0 && s.description) ||
              (s.newDescription?.length === 0 && s.description)
          )}
        />
      )}

      <UndoAllChangesDialog
        opened={dialog === 'undo'}
        changeCount={
          secrets?.filter(
            (s) =>
              s.action !== null ||
              (s.newDescription && !s.description) ||
              (s.description && s.newDescription !== s.description && s.newDescription) ||
              (s.newDescription && s.newDescription?.length === 0 && s.description) ||
              (s.newDescription?.length === 0 && s.description)
          )?.length
        }
        onClose={() => setDialog(null)}
        onConfirm={handleUndoAllSecretsChanges}
      />

      <div className="flex items-center gap-3 lg:gap-5 -mt-1">
        {loaded && (
          <>
            {secrets?.filter(
              (s) =>
                s.action !== null ||
                (!s.description && s.newDescription) ||
                (s.description && s.newDescription !== s.description && s.newDescription) ||
                (s.newDescription?.length === 0 && s.description)
            ).length > 0 && (
              <div className="text-[0.92rem] text-yellow-500 dark:text-yellow-600 font-medium">
                {getChangesText()}
              </div>
            )}
          </>
        )}

        <div className="flex items-center gap-2">
          {secrets?.filter(
            (s) =>
              s.action !== null ||
              (!s.description && s.newDescription) ||
              (s.description && s.newDescription !== s.description && s.newDescription) ||
              (s.newDescription?.length === 0 && s.description)
          ).length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant={'outline'} size={'sm'} onClick={() => setDialog('undo')}>
                    <Icons.undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo all changes</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {/* {loaded && secrets?.length !== 0 && ( */}
          {selectedEnv?.secretsLoaded === true && secrets?.length !== 0 && (
            <Button
              className="gap-2"
              size="sm"
              disabled={
                secrets?.length === 0 ||
                !secrets?.filter(
                  (s) =>
                    s.action !== null ||
                    (!s.description && s.newDescription) ||
                    (s.description && s.newDescription !== s.description && s.newDescription) ||
                    (s.newDescription?.length === 0 && s.description)
                )?.length
              }
              onClick={handleOpenDialog}
            >
              {/* <Icons.save className="w-4 h-4" /> */}
              {/* <span className="md:hidden block">Save </span> */}
              <span className="">Save changes</span>
            </Button>
          )}
          {/* )} */}

          {/*   <EnvActionsDropdown */}
          {/*     isLocked={selectedEnv?.locked} */}
          {/*     hideCopySecrets={!loaded} */}
          {/*     onCopy={copyEnv} */}
          {/*     onDelete={() => setDialog('delete')} */}
          {/*     onRename={() => setDialog('rename')} */}
          {/*     onLock={() => setDialog('lock')} */}
          {/*     onChangeType={() => setDialog('changeType')} */}
          {/*   /> */}
        </div>
      </div>
    </>
  )
}

export default SaveSecretsToolbar
