'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { SecretAction, useEditedSecretsStore } from '@/stores/secrets'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import SaveConfirmDialog from './SaveConfirmDialog'
import RenameEnvironmentDialog from '../environments/RenameEnvironmentDialog'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import DeleteEnvironmentDialog from '../environments/DeleteEnvironmentDialog'
import { Project } from '@/types/projects'
import { Secret } from '@/types/secrets'
import EnvActionsDropdown from './EnvActionsDropdown'
import LockEnvDialog from '../environments/LockEnvDialog'

const SaveSecretsToolbar = () => {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: selectedEnv, updateLocked } = useSelectedEnvironmentStore()

  const [saveDialogOpened, setSaveDialogOpened] = useState(false)
  const [renameEnvDialogOpened, setEnvRenameDialogOpened] = useState(false)
  const [deleteEnvDialogOpened, setDeleteEnvDialogOpened] = useState(false)
  const [lockEnvDialogOpened, setLockEnvDialogOpened] = useState(false)

  const { loaded, secrets } = useEditedSecretsStore((state) => {
    return {
      loaded: state.loaded,
      secrets: state.secrets,
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
    setSaveDialogOpened(false)

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

    setSaveDialogOpened(true)
  }

  const copyEnv = (type: 'env' | 'json') => {
    const secretsData = queryClient.getQueryData<Secret[]>([
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
      selectedEnv?.name,
      'secrets',
    ])

    if (!secretsData) return

    if (type === 'env') {
      const dotenvString = secretsData
        .map((obj) => {
          if (obj.description) {
            return `# ${obj.description}\n${obj.key}=${obj.value}`
          } else {
            return `${obj.key}=${obj.value}`
          }
        })
        .join('\n')
      navigator.clipboard.writeText(dotenvString)
    } else {
      const resultObject: { [key: string]: string } = secretsData.reduce((acc: any, obj: any) => {
        acc[obj.key] = obj.value
        return acc
      }, {})

      navigator.clipboard.writeText(JSON.stringify(resultObject, null, 2))
    }

    toast({
      title: 'Environment secrets copied to clipboard!',
      variant: 'success',
    })
  }

  const handleRenamedEnv = (newName: string) => {
    setEnvRenameDialogOpened(false)

    // update cache cache
    // TODO: update single item (check if env exists)

    // update list
    const projectData = queryClient.getQueryData<Project>([
      'project',
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
    ])

    if (projectData) {
      const environments = projectData?.environments
      const prevName = selectedEnv?.name

      const updatedEnvIndex = environments?.findIndex((e) => e.name === prevName)

      if (updatedEnvIndex !== -1) {
        const updated = environments?.[updatedEnvIndex]
        updated.name = newName

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
      `/workspace/${selectedEnv?.workspaceId}/projects/${selectedEnv?.projectName}/env/${newName}`
    )
  }

  const handleLockChange = (locked: boolean) => {
    setLockEnvDialogOpened(false)

    const projectData = queryClient.getQueryData<Project>([
      'project',
      selectedEnv?.workspaceId,
      selectedEnv?.projectName,
    ])

    if (projectData) {
      const environments = projectData?.environments
      const prevName = selectedEnv?.name

      const updatedEnvIndex = environments?.findIndex((e) => e.name === prevName)

      if (updatedEnvIndex !== -1) {
        const updated = environments?.[updatedEnvIndex]
        updated.locked = locked

        queryClient.setQueryData(['project', selectedEnv?.workspaceId, selectedEnv?.projectName], {
          ...projectData,
          environments,
        })
      }
    }
    updateLocked(locked)

    //TODO: update current + update state
  }

  const handleDeletedEnv = () => {
    setDeleteEnvDialogOpened(false)

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

    router.push(`/workspace/${selectedEnv?.workspaceId}/projects/${selectedEnv?.projectName}`)
  }

  if (!loaded || !selectedEnv) {
    return <></>
  }

  return (
    <>
      {true && (
        <SaveConfirmDialog
          opened={saveDialogOpened}
          workspaceId={selectedEnv.workspaceId}
          projectName={selectedEnv.projectName}
          envName={selectedEnv.name}
          secrets={secrets}
          onSuccess={handleUpdatedSecrets}
          onClose={() => setSaveDialogOpened(false)}
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

      <RenameEnvironmentDialog
        opened={renameEnvDialogOpened}
        workspaceId={selectedEnv.workspaceId}
        projectName={selectedEnv.projectName}
        envName={selectedEnv.name}
        onClose={() => setEnvRenameDialogOpened(false)}
        onSuccess={handleRenamedEnv}
      />

      <DeleteEnvironmentDialog
        opened={deleteEnvDialogOpened}
        workspaceId={selectedEnv.workspaceId}
        projectName={selectedEnv.projectName}
        envName={selectedEnv.name}
        onClose={() => setDeleteEnvDialogOpened(false)}
        onSuccess={handleDeletedEnv}
      />

      <LockEnvDialog
        opened={lockEnvDialogOpened}
        workspaceId={selectedEnv.workspaceId}
        projectName={selectedEnv.projectName}
        envName={selectedEnv.name}
        lock={!selectedEnv.locked}
        onClose={() => setLockEnvDialogOpened(false)}
        onSuccess={() => handleLockChange(!selectedEnv.locked)}
      />

      <div className="flex items-center gap-3 lg:gap-5 -mt-1">
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

        <div className="flex items-center gap-2">
          <Button
            className="gap-2"
            size="sm"
            disabled={
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
            <Icons.save className="w-4 h-4" />
            Save{' '}
          </Button>

          <EnvActionsDropdown
            isLocked={selectedEnv?.locked}
            onCopy={copyEnv}
            onDelete={() => setDeleteEnvDialogOpened(true)}
            onRename={() => setEnvRenameDialogOpened(true)}
            onLock={() => setLockEnvDialogOpened(true)}
          />
        </div>
      </div>
    </>
  )
}

export default SaveSecretsToolbar
