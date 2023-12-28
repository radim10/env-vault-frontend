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
import { useIsMutating } from '@tanstack/react-query'
import clsx from 'clsx'
import SecretsToolbar from './SecretsToolbar'
import { SecretAction, StateSecret, useEditedSecretsStore } from '@/stores/secrets'
import { useToast } from '../ui/use-toast'
import GenerateSecretDialog from './GenerateSecretDialog'
import ImportSecretsDrawer from './ImportSecretsDrawer'

interface Props {
  data: Secret[]
  readOnly?: boolean
}

const SecretsList: React.FC<Props> = ({ data, readOnly }) => {
  const { toast } = useToast()
  const isSaving = useIsMutating({ mutationKey: ['secrets-update'] }) === 1 ? true : false
  const [genereteDialogIndex, setGenerateDialogIndex] = useState<number | null>(null)
  const [importDialogOpened, setImportDialogOpened] = useState<boolean>(false)

  const {
    search,
    secrets,
    setSecrets,
    addSecret,
    resetSecrets,
    undoChanges,
    toggleVisibility,
    toggleDescription,
    toggleDeleted,
    toggleArchived,
    updateValue,
    updateKey,
    updateDescription,
  } = useEditedSecretsStore((state) => {
    return {
      search: state.search,
      secrets: state.secrets,
      setSecrets: state.set,
      addSecret: state.add,
      resetSecrets: state.reset,
      toggleVisibility: state.toggleVisibility,
      toggleDescription: state.toggleDescription,
      undoChanges: state.undoChanges,
      toggleDeleted: state.toggleDeleted,
      toggleArchived: state.toggleArchived,
      updateValue: state.updateValue,
      updateKey: state.updateKey,
      updateDescription: state.updateDescription,
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
        showDescription: secret?.description ? true : undefined,
      }

      return value
    })

    setSecrets(values)
  }

  const handleToggleVisibility = (args: { index: number; key: string }) => {
    const { key, index } = args
    if (search?.length === 0) {
      toggleVisibility(index)
    } else {
      const origIndex = data?.findIndex((item) => item.key === key)

      if (origIndex !== -1) {
        toggleVisibility(origIndex)
      }
    }
  }

  // key as an id
  const handleUpdateValue = (args: { index: number; key: string; value: string }) => {
    const { index, key, value } = args

    if (search?.length === 0) {
      const origItem = data?.[index]

      updateValue({ index, origValue: origItem?.value, newValue: value })
    } else {
      const origIndex = data?.findIndex((item) => item.key === key)

      if (origIndex !== -1) {
        const origItem = data?.[origIndex]
        updateValue({ index: origIndex, origValue: origItem?.value, newValue: value })
      }
    }
  }

  const handleUpdateKey = (args: { index: number; key: string; value: string }) => {
    const { index, key, value } = args

    if (search?.length === 0) {
      const origItem = data?.[index]
      updateKey({ index, origKey: origItem?.key, newKey: value })
    } else {
      const origIndex = data?.findIndex((item) => item.key === key)

      if (origIndex !== -1) {
        const origItem = data?.[origIndex]
        updateKey({ index: origIndex, origKey: origItem?.key, newKey: value })
      }
    }
  }

  const handleUndoChanges = (args: { index: number; key: string }) => {
    const { index, key } = args

    if (search?.length === 0) {
      const dataItem = data?.[index]
      if (!dataItem) return
      undoChanges({ index, origItem: dataItem })
    } else {
      const origIndex = data?.findIndex((item) => item.key === key)

      if (origIndex !== -1) {
        const dataItem = data?.[origIndex]
        undoChanges({ index: origIndex, origItem: dataItem })
      }
    }
  }

  const handleToggleDeleted = (args: { index: number; key: string }) => {
    const { index, key } = args

    if (search?.length === 0) {
      toggleDeleted(index)
    } else {
      const origIndex = data?.findIndex((item) => item.key === key)

      if (origIndex !== -1) toggleDeleted(origIndex)
    }
  }

  const handleToggleArchived = (args: { index: number; key: string }) => {
    const { index, key } = args

    if (search?.length === 0) {
      toggleArchived(index)
    } else {
      const origIndex = data?.findIndex((item) => item.key === key)

      if (origIndex !== -1) toggleArchived(origIndex)
    }
  }

  const handleToggleDescription = (args: { index: number; key: string }) => {
    const { index, key } = args

    if (search?.length === 0) {
      toggleDescription(index)
    } else {
      const origIndex = data?.findIndex((item) => item.key === key)

      if (origIndex !== -1) toggleDescription(origIndex)
    }
  }

  const handleUpdateDescription = (args: { index: number; key: string; value: string }) => {
    const { index, key, value } = args

    if (search?.length === 0) {
      const origItem = data?.[index]
      updateDescription({ index, origDescription: origItem?.description, newDescription: value })
    } else {
      const origIndex = data?.findIndex((item) => item.key === key)

      if (origIndex !== -1) {
        const origItem = data?.[origIndex]
        updateDescription({
          index: origIndex,
          origDescription: origItem?.description,
          newDescription: value,
        })
      }
    }
  }

  const copyValueToClipboard = (value: string) => {
    navigator.clipboard.writeText(value ?? '')

    toast({
      title: 'Value copied to clipboard!',
      variant: 'success',
    })
  }

  const handleGenerateDialogOpen = (args: { key: string; index: number }) => {
    if (search?.length === 0) {
      setGenerateDialogIndex(args.index)
    } else {
      const origIndex = data?.findIndex((item) => item.key === args.key)

      if (origIndex !== -1) {
        setGenerateDialogIndex(origIndex)
      }
    }
  }

  // TODO:
  const handleConfirmGeneratedSecret = (index: number, value: string) => {
    const origItem = data?.[index]
    updateValue({ index, origValue: origItem?.value, newValue: value })

    setGenerateDialogIndex(null)
  }

  const handleImportedSecrets = (values: Array<{ key: string; value: string }>) => {
    console.log(values)

    for (const { key, value } of values) {
      const existingIndex = secrets?.findIndex((item) => item.key === key || item.newKey === key)

      if (existingIndex !== -1) {
        const existingItem = secrets?.[existingIndex]

        if (!existingItem?.newValue) {
          if (existingItem?.value !== value) {
            updateValue({ index: existingIndex, origValue: existingItem?.value, newValue: value })
          }
        }
      } else {
        addSecret({ key, value })
      }
    }
  }

  const copyEnvSecrets = (type: 'env' | 'json') => {
    if (type === 'env') {
      const dotenvString = data
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
      const resultObject: { [key: string]: string } = data.reduce((acc: any, obj: any) => {
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

  if (!data?.length && secrets?.length === 0) {
    return (
      <>
        {!readOnly && (
          <ImportSecretsDrawer
            opened={importDialogOpened}
            onClose={() => setImportDialogOpened(false)}
            onConfirm={(values) => {
              setImportDialogOpened(false)
              setTimeout(() => {
                handleImportedSecrets(values)
              }, 50)
            }}
          />
        )}
        <div className="flex items-center justify-center mt-24">
          <div className="flex flex-col items-center gap-2">
            <div>
              <Icons.inbox className="h-20 w-20 opacity-30" />
            </div>
            <div className="text-center">
              <span className="text-lg font-bold opacity-85">No secrets here...</span>
              {!readOnly ? (
                <>
                  <div className="my-1 text-muted-foreground">Add secrets to this environment</div>
                  <div className="mt-5 flex items-center gap-3 justify-center">
                    <Button
                      className="gap-2"
                      onClick={() => addSecret()}
                      variant="default"
                      disabled={isSaving}
                    >
                      <Icons.plus className="h-5 w-5" />
                      Add secret
                    </Button>
                    <Button
                      className="gap-2"
                      onClick={() => setImportDialogOpened(true)}
                      variant="outline"
                    >
                      <Icons.upload className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="my-1 text-muted-foreground">
                  Only project admins/owners can modify secrets
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {!readOnly && (
        <>
          <GenerateSecretDialog
            index={genereteDialogIndex ?? 0}
            opened={genereteDialogIndex !== null}
            onClose={() => setGenerateDialogIndex(null)}
            onConfirm={(value) => {
              handleConfirmGeneratedSecret(genereteDialogIndex ?? 0, value)
            }}
          />

          <ImportSecretsDrawer
            opened={importDialogOpened}
            onClose={() => setImportDialogOpened(false)}
            onConfirm={(values) => {
              setImportDialogOpened(false)
              handleImportedSecrets(values)
            }}
          />
        </>
      )}
      {/*  */}

      <SecretsToolbar
        readonly={readOnly}
        secretsCount={secrets.length}
        onImport={() => setImportDialogOpened(true)}
        onCopySecrets={copyEnvSecrets}
      />
      {/* // */}
      <div className="mt-4 w-full flex flex-col gap-7 md:gap-3 justify-center items-start">
        {!secrets?.filter((val) => val?.key?.toLowerCase().includes(search?.toLowerCase()))
          .length && (
          <>
            <div className="flex items-center justify-center mt-6 w-full">
              <div className="flex flex-col items-center gap-2">
                <div>
                  <Icons.searchX className="h-20 w-20 opacity-30" />
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold opacity-85">No secrets found</span>
                </div>
              </div>
            </div>
          </>
        )}
        {/* // */}
        {secrets
          .filter(
            (val) => search?.length === 0 || val?.key.toLowerCase().includes(search.toLowerCase())
          )
          ?.map(
            (
              {
                key,
                value,
                hidden,
                action,
                newKey,
                newValue,
                description,
                newDescription,
                showDescription,
              },
              index
            ) => (
              <div key={index} className="flex flex-col md:flex-row gap-2 lg:gap-3.5 w-full">
                <div className="md:w-[35%] flex items-center gap-2 md:block ">
                  <Input
                    type="text"
                    value={newKey !== undefined ? newKey : key}
                    placeholder="Key"
                    readOnly={
                      action === SecretAction.Archived ||
                      action === SecretAction.Deleted ||
                      readOnly
                    }
                    disabled={isSaving}
                    onChange={(e) => handleUpdateKey({ index, key, value: e.target.value })}
                    className={clsx({
                      'font-semibold':
                        key.length > 0 ||
                        (newKey && newKey?.length > 0 && action === SecretAction.Created),
                      'border-red-600/90 focus-visible:ring-red-600/90 dark:border-red-600/70 dark:focus-visible:ring-red-600/70':
                        action === SecretAction.Deleted,
                      'border-indigo-600/90 focus-visible:ring-indigo-600/90 dark:border-indigo-600/70 dark:focus-visible:ring-indigo-600/70':
                        action === SecretAction.Archived,
                      'border-orange-600/90 focus-visible:ring-orange-600/90 dark:border-orange-600/70 dark:focus-visible:ring-orange-600/70':
                        newKey !== undefined && action === SecretAction.Updated,
                      'border-green-600/90 focus-visible:ring-green-600/90 dark:border-green-600/70 dark:focus-visible:ring-green-600/70':
                        action === SecretAction.Created &&
                        newKey?.trim().length !== 0 &&
                        newKey !== undefined,
                    })}
                  />

                  <div className="md:hidden">
                    <Dropdown
                      disabled={isSaving}
                      isCreated={action === SecretAction.Created}
                      onUndo={() => handleUndoChanges({ index, key })}
                      onDelete={() => handleToggleDeleted({ index, key })}
                      onArchive={() => handleToggleArchived({ index, key })}
                      canDelete={action === null || action === SecretAction.Created}
                      canUndo={
                        (action !== SecretAction.Created && action !== null) ||
                        (newDescription?.length === 0 && description) ||
                        (description && newDescription && newDescription?.length > 0)
                          ? true
                          : false
                      }
                      onCopy={() => copyValueToClipboard(value)}
                      onGenerate={() => handleGenerateDialogOpen({ key, index })}
                      // canArchive={(action !== SecretAction.Created && action !== SecretAction.Deleted) || action === null}
                      canArchive={action === null}
                    />
                  </div>
                </div>

                <div className="flex flex-grow flex-col gap-2.5">
                  <div className="flex-grow flex items-center gap-3">
                    <div className="w-full flex justify-end items-center relative">
                      <Input
                        type="text"
                        value={hidden ? '•••••••••••' : newValue !== undefined ? newValue : value}
                        placeholder="Empty value"
                        disabled={isSaving}
                        readOnly={
                          hidden ||
                          action === SecretAction.Archived ||
                          action === SecretAction.Deleted ||
                          readOnly
                        }
                        onChange={(e) => handleUpdateValue({ index, key, value: e.target.value })}
                        className={clsx(['pr-[5.5em]'], {
                          'border-red-600/90 focus-visible:ring-red-600/90 dark:border-red-600/70 dark:focus-visible:ring-red-600/70':
                            action === SecretAction.Deleted,
                          'border-indigo-600/90 focus-visible:ring-indigo-600/90 dark:border-indigo-600/70 dark:focus-visible:ring-indigo-600/70':
                            action === SecretAction.Archived,
                          'border-orange-700/90 focus-visible:ring-orange-600/90 dark:border-orange-600/70 dark:focus-visible:ring-orange-600/70':
                            // action === Action.Updated,
                            newValue !== undefined && action === SecretAction.Updated,
                          'border-green-600/90 focus-visible:ring-green-600/90 dark:border-green-600/70 dark:focus-visible:ring-green-600/70':
                            action === SecretAction.Created &&
                            newValue?.trim().length !== 0 &&
                            newValue !== undefined,
                        })}
                      />
                      <div
                        className={clsx(
                          [
                            'absolute mr-5XX w-10 flex justify-center items-center gap-2 md:gap-3.5',
                          ],
                          {
                            'mr-5': !readOnly || (description && description?.length > 0),
                            'mr-1': !(!readOnly || (description && description?.length > 0)),
                          }
                        )}
                      >
                        <button onClick={() => handleToggleVisibility({ key, index })}>
                          {hidden ? (
                            <Icons.eye className="opacity-50 h-[1.1rem] w-[1.1rem] hover:text-primary hover:opacity-100" />
                          ) : (
                            <Icons.eyeOff className="opacity-50 h-[1.1rem] w-[1.1rem] hover:text-primary hover:opacity-100" />
                          )}
                        </button>
                        {(!readOnly || (description && description?.length > 0)) && (
                          <button onClick={() => handleToggleDescription({ key, index })}>
                            <Icons.fileText
                              className={clsx(
                                ['opacity-50 h-[1.1rem] w-[1.1rem]  hover:opacity-100'],
                                {
                                  'opacity-80': showDescription === true,
                                  'opacity-[65%]': !showDescription,
                                  'hover:text-primary':
                                    (!description &&
                                      (!newDescription || newDescription?.length === 0)) ||
                                    (newDescription === description && description?.length !== 0),
                                  'text-primary hover:text-primary':
                                    (description !== undefined && !newDescription) ||
                                    (showDescription && !newDescription && !description) ||
                                    // NEW condition
                                    (newDescription === description &&
                                      newDescription &&
                                      description &&
                                      description?.length > 0 &&
                                      newDescription?.length > 0),
                                  'text-green-600/90 dark:text-green-500/80 opacity-70':
                                    description === undefined &&
                                    newDescription &&
                                    newDescription?.length > 0 &&
                                    action !== SecretAction.Deleted,
                                  'text-orange-600/90 dark:text-orange-500/80 opacity-70':
                                    description &&
                                    newDescription &&
                                    description !== newDescription &&
                                    newDescription?.length > 0 &&
                                    action !== SecretAction.Deleted,
                                  'text-red-600/90 dark:text-red-500/80 opacity-70':
                                    (newDescription?.length === 0 && description) ||
                                    action === SecretAction.Deleted,
                                }
                              )}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="hidden md:block">
                      {!readOnly ? (
                        <Dropdown
                          disabled={isSaving}
                          isCreated={action === SecretAction.Created}
                          onUndo={() => handleUndoChanges({ index, key })}
                          onDelete={() => handleToggleDeleted({ index, key })}
                          canDelete={action === null || action === SecretAction.Created}
                          onArchive={() => handleToggleArchived({ index, key })}
                          onCopy={() => copyValueToClipboard(value)}
                          canUndo={
                            (action !== SecretAction.Created && action !== null) ||
                            (newDescription?.length === 0 && description) ||
                            (description && newDescription && newDescription?.length > 0)
                              ? true
                              : false
                          }
                          onGenerate={() => handleGenerateDialogOpen({ key, index })}
                          canArchive={action === null}
                        />
                      ) : (
                        <>
                          <Button
                            size={'icon'}
                            variant={'outline'}
                            onClick={() => copyValueToClipboard(value)}
                          >
                            <Icons.copy className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* // */}

                  {showDescription && (
                    <Input
                      placeholder={'Description...'}
                      className={clsx({
                        'border-red-600/90 focus-visible:ring-red-600/90 dark:border-red-600/70 dark:focus-visible:ring-red-600/70':
                          (newDescription?.length === 0 && description) ||
                          action === SecretAction.Deleted,
                        'border-green-600/90 focus-visible:ring-green-600/90 dark:border-green-600/70 dark:focus-visible:ring-green-600/70':
                          description === undefined &&
                          newDescription &&
                          newDescription?.length > 0 &&
                          action !== SecretAction.Deleted,
                        'border-orange-600/90 focus-visible:ring-orange-600/90 dark:border-orange-600/70 dark:focus-visible:ring-orange-600/70':
                          description &&
                          newDescription &&
                          newDescription?.length > 0 &&
                          newDescription !== description &&
                          action !== SecretAction.Deleted,
                      })}
                      value={newDescription !== undefined ? newDescription : description}
                      onChange={(e) =>
                        handleUpdateDescription({ index, key, value: e.target.value })
                      }
                      readOnly={
                        action === SecretAction.Archived ||
                        action === SecretAction.Deleted ||
                        readOnly
                      }
                    />
                  )}
                </div>
              </div>
            )
          )}
      </div>

      {/* FOOTER  */}
      {!search?.length && !readOnly && (
        <div className="mt-5">
          <Button
            className="gap-2"
            onClick={() => addSecret()}
            variant="outline"
            disabled={isSaving}
          >
            <Icons.plus className="h-5 w-5" />
            Add new
          </Button>
        </div>
      )}
    </>
  )
}

interface DropdowProps {
  disabled: boolean
  isCreated: boolean
  canUndo: boolean
  canArchive: boolean
  canDelete: boolean
  onUndo: () => void
  onDelete: () => void
  onArchive: () => void
  onCopy: () => void
  onGenerate: () => void
}

const Dropdown: React.FC<DropdowProps> = ({
  disabled,
  isCreated,
  canArchive,
  canUndo,
  canDelete,
  onUndo,
  onDelete,
  onArchive,
  onCopy,
  onGenerate,
}) => {
  const [opened, setOpen] = useState(false)
  const items = isCreated
    ? [
        {
          icon: Icons.refresh,
          text: 'Generate',
        },
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
    : [
        {
          icon: Icons.copy,
          text: 'Copy',
        },
        {
          icon: Icons.refresh,
          text: 'Generate',
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
        {items
          ?.filter((val) =>
            isCreated
              ? val.text !== 'Archive' && val?.text !== 'Undo'
              : !canDelete
              ? val?.text !== 'Generate'
              : val
          )
          ?.map((item) => (
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
                    onCopy()
                  } else if (item.text === 'Undo') {
                    onUndo()
                  } else if (item.text === 'Generate') {
                    onGenerate()
                  }
                }}
                className={clsx(['flex gap-4 items-center px-3.5'], {
                  'dark:hover:text-red-500 dark:text-red-500 text-red-600 hover:text-red-600':
                    item.text === 'Delete',
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
