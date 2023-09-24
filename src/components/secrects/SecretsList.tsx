'use client'

import { Secret } from '@/types/secrets'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { useMount, useUnmount, useUpdateEffect } from 'react-use'
import { QueryClient, useIsMutating } from '@tanstack/react-query'
import clsx from 'clsx'
import SecretsToolbar from './SecretsToolbar'
import { SecretAction, StateSecret, useEditedSecretsStore } from '@/stores/secrets'

interface Props {
  data: Secret[]
}

const SecretsList: React.FC<Props> = ({ data }) => {
  // const isSaving = queryClient.isMutating({mutationKey:['secrets-update']});
  const isSaving = useIsMutating({ mutationKey: ['secrets-update'] }) === 1 ? true : false

  const {
    secrets,
    setSecrets,
    addSecret,
    resetSecrets,
    undoChanges,
    toggleVisibility,
    toggleDeleted,
    toggleArchived,
    updateValue,
    updateKey,
  } = useEditedSecretsStore((state) => {
    return {
      secrets: state.secrets,
      setSecrets: state.set,
      addSecret: state.add,
      resetSecrets: state.reset,
      toggleVisibility: state.toggleVisibility,
      undoChanges: state.undoChanges,
      toggleDeleted: state.toggleDeleted,
      toggleArchived: state.toggleArchived,
      updateValue: state.updateValue,
      updateKey: state.updateKey,
    }
  })

  useUpdateEffect(() => {
    setInititalState(data)
  }, [data])

  useMount(() => {
    setInititalState(data)
  })

  useUnmount(() => resetSecrets())

  const setInititalState = (data: Secret[]) => {
    const values = data.map((secret) => {
      const value: StateSecret = {
        ...secret,
        hidden: true,
        action: null,
      }

      return value
    })

    setSecrets(values)
  }

  const handleUpdateValue = (index: number, value: string) => {
    const origItem = data?.[index]
    updateValue({ index, origValue: origItem?.value, newValue: value })
  }

  const handleUpdateKey = (index: number, value: string) => {
    const origItem = data?.[index]
    updateKey({ index, origKey: origItem?.key, newKey: value })
  }

  const handleUndoChanges = (index: number) => {
    const dataItem = data?.[index]
    if (!dataItem) return

    undoChanges({ index, origItem: dataItem })
  }

  return (
    <>
      {isSaving}
      <SecretsToolbar secretsCount={secrets.length} />
      {/* // */}
      <div className="mt-4 w-full flex flex-col gap-7 md:gap-3 justify-center items-start">
        {secrets.map(({ key, value, hidden, action, newKey, newValue }, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-2 lg:gap-3.5 w-full">
            <div className="md:w-[35%] flex items-center gap-2 md:block ">
              <Input
                type="text"
                value={newKey !== undefined ? newKey : key}
                placeholder="Key"
                readOnly={action === SecretAction.Archived || action === SecretAction.Deleted}
                disabled={isSaving}
                onChange={(e) => handleUpdateKey(index, e.target.value)}
                className={clsx({
                  'font-semibold': key.length > 0,
                  'border-red-500/70 focus-visible:ring-red-500/70 dark:border-red-600/70 dark:focus-visible:ring-red-600/70':
                    action === SecretAction.Deleted,
                  'border-indigo-500/70 focus-visible:ring-indigo-500/70 dark:border-indigo-600/70 dark:focus-visible:ring-indigo-600/70':
                    action === SecretAction.Archived,
                  'border-orange-500/70 focus-visible:ring-orange-500/70 dark:border-orange-600/70 dark:focus-visible:ring-orange-600/70':
                    newKey !== undefined && action === SecretAction.Updated,
                  'border-green-500/70 focus-visible:ring-green-500/70 dark:border-green-600/70 dark:focus-visible:ring-green-600/70':
                    action === SecretAction.Created &&
                    newKey?.trim().length !== 0 &&
                    newKey !== undefined,
                })}
              />

              <div className="md:hidden">
                <Dropdown
                  disabled={isSaving}
                  onUndo={() => handleUndoChanges(index)}
                  onDelete={() => toggleDeleted(index)}
                  onArchive={() => toggleArchived(index)}
                  canDelete={action === null}
                  canUndo={action !== SecretAction.Created && action !== null}
                  // canArchive={(action !== SecretAction.Created && action !== SecretAction.Deleted) || action === null}
                  canArchive={action === null}
                />
              </div>
            </div>

            <div className="flex-grow flex items-center gap-3">
              <div className="w-full flex justify-end items-center relative">
                <Input
                  type="text"
                  value={hidden ? '•••••••••••' : newValue !== undefined ? newValue : value}
                  placeholder="Empty value"
                  disabled={isSaving}
                  readOnly={
                    hidden || action === SecretAction.Archived || action === SecretAction.Deleted
                  }
                  onChange={(e) => handleUpdateValue(index, e.target.value)}
                  className={clsx(['pr-12'], {
                    'border-red-500/70 focus-visible:ring-red-500/70 dark:border-red-600/70 dark:focus-visible:ring-red-600/70':
                      action === SecretAction.Deleted,
                    'border-indigo-500/70 focus-visible:ring-indigo-500/70 dark:border-indigo-600/70 dark:focus-visible:ring-indigo-600/70':
                      action === SecretAction.Archived,
                    'border-orange-500/70 focus-visible:ring-orange-500/70 dark:border-orange-600/70 dark:focus-visible:ring-orange-600/70':
                      // action === Action.Updated,
                      newValue !== undefined && action === SecretAction.Updated,
                    'border-green-500/70 focus-visible:ring-green-500/70 dark:border-green-600/70 dark:focus-visible:ring-green-600/70':
                      action === SecretAction.Created &&
                      newValue?.trim().length !== 0 &&
                      newValue !== undefined,
                  })}
                />
                <div className="absolute mr-1.5 w-10 flex justify-center items-center">
                  <button onClick={() => toggleVisibility(index)}>
                    {hidden ? (
                      <Icons.eye className="opacity-60 h-[1.1rem] w-[1.1rem] hover:text-primary hover:opacity-100" />
                    ) : (
                      <Icons.eyeOff className="opacity-60 h-[1.1rem] w-[1.1rem] hover:text-primary hover:opacity-100" />
                    )}
                  </button>
                </div>
              </div>

              <div className="hidden md:block">
                <Dropdown
                  disabled={isSaving}
                  onUndo={() => handleUndoChanges(index)}
                  onDelete={() => toggleDeleted(index)}
                  canDelete={action === null}
                  onArchive={() => toggleArchived(index)}
                  canUndo={action !== SecretAction.Created && action !== null}
                  canArchive={action === null}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER  */}
      <div className="mt-5">
        <Button className="gap-2" onClick={addSecret} variant="outline" disabled={isSaving}>
          <Icons.plus className="h-5 w-5" />
          Add new
        </Button>
      </div>
    </>
  )
}

interface DropdowProps {
  disabled: boolean
  canUndo: boolean
  canArchive: boolean
  canDelete: boolean
  onUndo: () => void
  onDelete: () => void
  onArchive: () => void
  onCopy?: () => void
}

const Dropdown: React.FC<DropdowProps> = ({
  disabled,
  canArchive,
  canUndo,
  canDelete,
  onUndo,
  onDelete,
  onArchive,
  onCopy,
}) => {
  const [opened, setOpen] = useState(false)
  const items = [
    {
      icon: Icons.copy,
      text: 'Copy',
    },
    {
      icon: Icons.undo,
      text: 'Undo',
    },
    {
      icon: Icons.archive,
      text: 'Archive',
    },
    {
      icon: Icons.trash,
      text: 'Delete',
    },
  ]

  return (
    <DropdownMenu onOpenChange={(e) => setOpen(e)}>
      <DropdownMenuTrigger disabled={disabled}>
        <Button variant={!opened ? 'outline' : 'secondary'} size={'icon'}>
          {!opened ? <Icons.moreHorizontal className="h-5 w-5" /> : <Icons.x className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-10 w-[150px] py-1 shadow-lg shadow-primary-foreground">
        {items?.map((item, index) => (
          <>
            <DropdownMenuItem
              disabled={
                (item.text === 'Undo' && !canUndo) ||
                (item.text === 'Archive' && !canArchive) ||
                (item.text === 'Delete' && !canDelete)
              }
              onClick={() => {
                if (item.text === 'Delete') {
                  onDelete()
                } else if (item.text === 'Archive') {
                  onArchive()
                } else if (item.text === 'Copy') {
                } else if (item.text === 'Undo') {
                  onUndo()
                }
              }}
              className={clsx(['flex gap-4 items-center px-3.5'], {
                'hover:text-red-500 text-red-500': index === items.length - 1,
              })}
            >
              <item.icon className=" h-4 w-4 opacity-70" />
              <>{item.text}</>
            </DropdownMenuItem>
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SecretsList
