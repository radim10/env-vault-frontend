'use client'

import { Secret } from '@/types/secrets'
import React, { useState } from 'react'
import { useImmer } from 'use-immer'
import { Input } from '../ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { useMount } from 'react-use'
import clsx from 'clsx'
import SecretsToolbar from './SecretsToolbar'

interface Props {
  data: Secret[]
}

type StateSecret = Secret & {
  hidden: boolean
  action: Action | null
  updatedKey?: boolean
  updatedValue?: boolean
}

enum Action {
  Created,
  Updated,
  Archived,
  Deleted,
}

const SecretsList: React.FC<Props> = ({ data }) => {
  const [secrets, setSecrets] = useImmer<Array<StateSecret>>([])

  useMount(() => {
    const values = data.map((secret) => {
      const value: StateSecret = {
        ...secret,
        hidden: true,
        action: null,
      }

      return value
    })

    setSecrets(values)
  })

  const addSecret = () => {
    setSecrets((draft) => {
      draft.push({
        key: '',
        value: '',
        hidden: false,
        action: Action.Created,
      })
    })
  }

  const toggleVisibility = (index: number) => {
    setSecrets((draft) => {
      draft[index].hidden = !draft[index].hidden
    })
  }

  const toggleDeleted = (index: number) => {
    setSecrets((draft) => {
      const item = draft[index]

      if (item.action === Action.Created) {
        draft.splice(index, 1)
      } else {
        if (item.action === Action.Deleted) {
          item.action = null
        } else {
          item.action = Action.Deleted
        }
      }
    })
  }

  const toggleArchived = (index: number) => {
    setSecrets((draft) => {
      const item = draft[index]

      if (item.action === Action.Created) {
        // no action
      } else {
        if (item.action === Action.Archived) {
          item.action = null
        } else {
          item.action = Action.Archived
        }
      }
    })
  }

  const updateValue = (index: number, value: string) => {
    const origItem = data?.[index]

    setSecrets((draft) => {
      const item = draft[index]
      item.value = value

      if (item?.action !== Action.Created) {
        if (origItem?.value !== value) {
          item.action = Action.Updated
          item.updatedValue = true
        } else if (item?.value === origItem?.value && item.action === Action.Updated) {
          item.action = null
          item.updatedValue = false
        }
      }
    })
  }

  const updateKey = (index: number, key: string) => {
    const origItem = data?.[index]

    setSecrets((draft) => {
      const item = draft[index]
      item.key = key.replace(/ /g, '_')

      if (item?.action !== Action.Created) {
        if (item?.key !== origItem?.key) {
          item.action = Action.Updated
          item.updatedKey = true
        } else if (item?.key === origItem?.key && item.action === Action.Updated) {
          item.action = null
          item.updatedKey = false
        }
      }
    })
  }

  const undoChanges = (index: number) => {
    const dataItem = data?.[index]

    if (!dataItem) return

    setSecrets((draft) => {
      draft[index] = { ...dataItem, action: null, hidden: true }
    })
  }

  return (
    <>
      <SecretsToolbar secretsCount={secrets.length} />
      {/* // */}
      <div className="mt-4 w-full flex flex-col gap-7 md:gap-3 justify-center items-start">
        {secrets.map(({ key, value, hidden, action, updatedValue, updatedKey }, index) => (
          <div className="flex flex-col md:flex-row gap-2 lg:gap-3.5 w-full">
            <div className="md:w-[35%] flex items-center gap-2 md:block ">
              <Input
                type="text"
                value={key}
                placeholder="Key"
                readOnly={action === Action.Archived || action === Action.Deleted}
                onChange={(e) => updateKey(index, e.target.value)}
                className={clsx({
                  'font-semibold': key.length > 0,
                  'border-red-500/70 focus-visible:ring-red-500/70 dark:border-red-600/70 dark:focus-visible:ring-red-600/70':
                    action === Action.Deleted,
                  'border-indigo-500/70 focus-visible:ring-indigo-500/70 dark:border-indigo-600/70 dark:focus-visible:ring-indigo-600/70':
                    action === Action.Archived,
                  'border-orange-500/70 focus-visible:ring-orange-500/70 dark:border-orange-600/70 dark:focus-visible:ring-orange-600/70':
                    updatedKey === true,
                  'border-green-500/70 focus-visible:ring-green-500/70 dark:border-green-600/70 dark:focus-visible:ring-green-600/70':
                    action === Action.Created && key?.trim().length !== 0,
                })}
              />

              <div className="md:hidden">
                <Dropdown
                  onUndo={() => undoChanges(index)}
                  onDelete={() => toggleDeleted(index)}
                  onArchive={() => toggleArchived(index)}
                />
              </div>
            </div>

            <div className="flex-grow flex items-center gap-3">
              <div className="w-full flex justify-end items-center relative">
                <Input
                  type={hidden ? 'password' : 'text'}
                  value={value}
                  placeholder="Empty value"
                  readOnly={hidden || action === Action.Archived || action === Action.Deleted}
                  onChange={(e) => updateValue(index, e.target.value)}
                  className={clsx(['pr-12'], {
                    'border-red-500/70 focus-visible:ring-red-500/70 dark:border-red-600/70 dark:focus-visible:ring-red-600/70':
                      action === Action.Deleted,
                    'border-indigo-500/70 focus-visible:ring-indigo-500/70 dark:border-indigo-600/70 dark:focus-visible:ring-indigo-600/70':
                      action === Action.Archived,
                    'border-orange-500/70 focus-visible:ring-orange-500/70 dark:border-orange-600/70 dark:focus-visible:ring-orange-600/70':
                      // action === Action.Updated,
                      updatedValue === true,
                    'border-green-500/70 focus-visible:ring-green-500/70 dark:border-green-600/70 dark:focus-visible:ring-green-600/70':
                      action === Action.Created && value?.trim().length !== 0,
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
                  onUndo={() => undoChanges(index)}
                  onDelete={() => toggleDeleted(index)}
                  onArchive={() => toggleArchived(index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER  */}
      <div className="mt-5">
        <Button className="gap-2" onClick={addSecret} variant="outline">
          <Icons.plus className="h-5 w-5" />
          Add new
        </Button>
      </div>
    </>
  )
}

interface DropdowProps {
  onUndo: () => void
  onDelete: () => void
  onArchive: () => void
  onCopy?: () => void
}

const Dropdown: React.FC<DropdowProps> = ({ onUndo, onDelete, onArchive, onCopy }) => {
  const [opened, setOpen] = useState(false)
  const items = [
    {
      icon: Icons.undo,
      text: 'Undo',
    },
    {
      icon: Icons.copy,
      text: 'Copy',
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
      <DropdownMenuTrigger>
        <Button variant={!opened ? 'outline' : 'secondary'} size={'icon'}>
          {!opened ? <Icons.moreHorizontal className="h-5 w-5" /> : <Icons.x className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-10 w-[150px] py-1 shadow-lg shadow-primary-foreground">
        {items?.map((item, index) => (
          <>
            <DropdownMenuItem
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
              className={clsx(['flex gap-3 items-center'], {
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
