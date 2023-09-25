'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { SecretAction, useEditedSecretsStore } from '@/stores/secrets'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import SaveConfirmDialog from './SaveConfirmDialog'
import RenameEnvironmentDialog from '../environments/RenameEnvironmentDialog'
import { useSelectedEnvironmentStore } from '@/stores/selectedEnv'
import DeleteEnvironmentDialog from '../environments/DeleteEnvironmentDialog'

const dropdownActionItems = [
  { label: 'Rename', icon: Icons.pencil },
  { label: 'Delete', icon: Icons.trash },
]

// TODO:
const dropdownActionSecretsItems = [
  { label: 'Copy secrets (.env)', icon: Icons.fileText },
  { label: 'Copy secrets (json)', icon: Icons.fileJson },
]

const SaveSecretsToolbar = () => {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const selectedEnv = useSelectedEnvironmentStore((state) => state?.data)

  const [saveDialogOpened, setSaveDialogOpened] = useState(false)
  const [renameEnvDialogOpened, setEnvRenameDialogOpened] = useState(false)
  const [deleteEnvDialogOpened, setDeleteEnvDialogOpened] = useState(false)

  const { loaded, secrets } = useEditedSecretsStore((state) => {
    return {
      loaded: state.loaded,
      secrets: state.secrets,
    }
  })

  const getChangesText = (): string => {
    const changes = secrets?.filter((s) => s.action !== null)
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
      ?.map(({ value, key, newKey, newValue }) => {
        return {
          key: newKey !== undefined ? newKey : key,
          value: newValue !== undefined ? newValue : value,
        }
      })

    queryClient.setQueryData(
      [selectedEnv?.workspaceId, selectedEnv?.projectName, selectedEnv?.envName, 'secrets'],
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

  const handleRenamedEnv = (newName: string) => {
    setEnvRenameDialogOpened(false)
    router.push(
      `/workspace/${selectedEnv?.workspaceId}/projects/${selectedEnv?.projectName}/env/${newName}`
    )
  }

  const handleDeletedEnv = () => {
    setDeleteEnvDialogOpened(false)
    router.push(`/workspace/${selectedEnv?.workspaceId}/projects/${selectedEnv?.projectName}`)
  }

  if (!loaded || !selectedEnv) {
    return <></>
  }

  return (
    <>
      {secrets?.filter((s) => s.action !== null)?.length !== 0 && (
        <SaveConfirmDialog
          opened={saveDialogOpened}
          workspaceId={selectedEnv.workspaceId}
          projectName={selectedEnv.projectName}
          envName={selectedEnv.envName}
          secrets={secrets}
          onSuccess={handleUpdatedSecrets}
          onClose={() => setSaveDialogOpened(false)}
          changesCount={secrets?.filter((s) => s.action !== null)?.length}
        />
      )}

      <RenameEnvironmentDialog
        opened={renameEnvDialogOpened}
        workspaceId={selectedEnv.workspaceId}
        projectName={selectedEnv.projectName}
        envName={selectedEnv.envName}
        onClose={() => setEnvRenameDialogOpened(false)}
        onSuccess={handleRenamedEnv}
      />

      <DeleteEnvironmentDialog
        opened={deleteEnvDialogOpened}
        workspaceId={selectedEnv.workspaceId}
        projectName={selectedEnv.projectName}
        envName={selectedEnv.envName}
        onClose={() => setDeleteEnvDialogOpened(false)}
        onSuccess={handleDeletedEnv}
      />

      <div className="flex items-center gap-3 lg:gap-5 -mt-1">
        {secrets?.filter((s) => s.action !== null).length > 0 && (
          <div className="text-[0.92rem] text-yellow-500 dark:text-yellow-600 font-medium">
            {getChangesText()}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            className="gap-2"
            size="sm"
            disabled={!secrets?.filter((s) => s.action !== null)?.length}
            onClick={handleOpenDialog}
          >
            <Icons.save className="w-4 h-4" />
            Save{' '}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={'outline'} size={'sm'}>
                <Icons.moreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-10 w-[200px] mt-1">
              {dropdownActionSecretsItems.map((item) => (
                <DropdownMenuItem
                  onClick={() => {}}
                  className={clsx(['flex items-center gap-3 px-3.5 py-2'], {})}
                >
                  <item.icon className={clsx(['h-4 w-4 opacity-70'])} />
                  <div className="">{item.label}</div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {dropdownActionItems.map((item) => (
                  <DropdownMenuItem
                    onClick={() => {
                      if (item.label === 'Rename') {
                        setEnvRenameDialogOpened(true)
                      } else if (item.label === 'Delete') {
                        setDeleteEnvDialogOpened(true)
                      }
                    }}
                    className={clsx(['flex items-center gap-3 px-3.5 py-2'], {
                      'text-red-500 dark:hover:text-red-500 hover:text-red-500':
                        item.label === 'Delete',
                    })}
                  >
                    <item.icon className={clsx(['h-4 w-4 opacity-70'])} />
                    <div className="">{item.label}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}

export default SaveSecretsToolbar
