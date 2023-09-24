'use client'

import React from 'react'
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
import { useUpdateSecrets } from '@/api/mutations/secrets'
import { UpdatedSecret, UpdatedSecretsBody } from '@/types/secrets'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'

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
  const { toast } = useToast()
  const queryClient = useQueryClient()
  // TODO: save current opened secret params to store???
  const params = useParams() as { workspace: string; projectName: string; env: string }

  const { loaded, secrets } = useEditedSecretsStore((state) => {
    return {
      loaded: state.loaded,
      secrets: state.secrets,
    }
  })

  const {
    mutate: updateSecret,
    isLoading,
    error,
  } = useUpdateSecrets({
    onSuccess: () => {
      updateCache()

      toast({
        title: 'Secrets have been updated',
        variant: 'success',
      })
    },
  })

  const getChangesText = (): string => {
    const changes = secrets?.filter((s) => s.action !== null)
    let text = changes?.length > 1 ? 'changes' : 'change'

    return `${changes?.length} ${text}`
  }

  const handleUpdateSecrets = () => {
    const changes = secrets?.filter((s) => s.action !== null)

    let data: UpdatedSecretsBody = []

    for (const { key, action, updatedKey, updatedValue } of changes) {
      const updated: UpdatedSecret = {
        // orig key
        key: action !== SecretAction.Created ? key : undefined,
        newKey:
          action === SecretAction.Created || (updatedKey && action === SecretAction.Updated)
            ? key
            : undefined,
        newValue:
          action === SecretAction.Created || (updatedValue && action === SecretAction.Updated)
            ? key
            : undefined,
        deleted: action === SecretAction.Deleted,
      }

      data.push(updated)
    }

    updateSecret({
      workspaceId: params.workspace,
      projectName: params.projectName,
      envName: params.env,
      data,
    })

    console.log(data)
  }

  const updateCache = () => {
    const updatedSecrets = secrets
      ?.filter((val) => val?.action !== SecretAction.Deleted)
      ?.map(({ value, key }) => {
        return {
          key,
          value,
        }
      })

    queryClient.setQueryData(
      [params.workspace, params.projectName, params.env, 'secrets'],
      updatedSecrets
    )
  }

  if (!loaded) {
    return <></>
  }

  return (
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
          onClick={handleUpdateSecrets}
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
                  onClick={() => {}}
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
  )
}

export default SaveSecretsToolbar
