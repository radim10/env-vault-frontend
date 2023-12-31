import { useCallback, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useImmer } from 'use-immer'
import { useDebounce, useUpdateEffect } from 'react-use'
import dayjs, { Dayjs } from 'dayjs'
import { Icons } from '@/components/icons'
import { WorkspaceToken } from '@/types/tokens/workspace'
import { useCreateWorkspaceToken } from '@/api/mutations/tokens/workspace'
import { tokensErrorMsgFromCode } from '@/api/requests/tokens'
import { Separator } from '../ui/separator'
import DialogComponent from '../Dialog'
import clsx from 'clsx'

interface Props {
  workspaceId: string
  opened: boolean
  onClose: () => void
  onSuccess: (data: WorkspaceToken) => void
}

interface Permission {
  text: string
  checked: boolean
}

interface Resource {
  name: string
  permissions: Permission[]
}

interface Permissions {
  [resource: string]: string[]
}

const convertToPermissionsObject = (permissionsArray: Resource[]): Permissions => {
  const permissions: Permissions = {}

  permissionsArray.forEach((resource) => {
    const actions: string[] = []
    resource.permissions.forEach((permission) => {
      if (permission.checked) {
        actions.push(permission.text.toLowerCase())
      }
    })

    if (actions.length !== 0) {
      permissions[resource.name.toLowerCase()] = actions
    }
  })

  console.log(permissions)

  return permissions
}

export const CreateWorkspaceTokenDialog: React.FC<Props> = ({
  workspaceId,
  opened,
  onClose,
  onSuccess,
}) => {
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [permissions, setPermissions] = useImmer([
    {
      name: 'Projects',
      permissions: [
        {
          text: 'Read',
          checked: false,
        },
        {
          text: 'Write',
          checked: false,
        },
        {
          text: 'Delete',
          checked: false,
        },
      ],
    },

    {
      name: 'Environments',
      permissions: [
        {
          text: 'Read',
          checked: false,
        },
        {
          text: 'Write',
          checked: false,
        },
        {
          text: 'Delete',
          checked: false,
        },
      ],
    },
    {
      name: 'Secrets',
      permissions: [
        {
          text: 'Read',
          checked: false,
        },
        {
          text: 'Write',
          checked: false,
        },
        {
          text: 'Delete',
          checked: false,
        },
      ],
    },
  ])
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null)
  const [expiration, setExpiration] = useImmer<{
    hours?: number
    days?: number
  } | null>(null)

  useDebounce(
    () => {
      if (expiration) {
        setExpirationDate(
          dayjs()
            .add(expiration.days ?? 0, 'day')
            .add(expiration.hours ?? 0, 'hour')
        )
      } else {
        setExpirationDate(null)
      }
    },
    150,
    [expiration]
  )

  const allPermissionsSelected = useCallback(() => {
    if (
      permissions?.[0]?.permissions?.filter((p) => p.checked).length === 3 &&
      permissions?.[1]?.permissions?.filter((p) => p.checked).length === 3 &&
      permissions?.[2]?.permissions?.filter((p) => p.checked).length === 3
    ) {
      return true
    }
    return false
  }, [permissions])

  const isAtLeastOneChecked = useCallback(() => {
    return permissions.some((resource) => {
      return resource.permissions.some((permission) => permission.checked)
    })
  }, [permissions])

  useUpdateEffect(() => {
    if (opened && copied) setCopied(false)
  }, [opened])

  useUpdateEffect(() => {
    if (!opened) {
      setTimeout(() => reset(), 150)
      if (name?.length > 0) setName('')

      if (isAtLeastOneChecked()) {
        setPermissions((draft) => {
          draft.forEach((entity) => {
            entity.permissions.forEach((permission) => {
              permission.checked = false
            })
          })
        })
      }

      if (expiration?.hours || expiration?.days) {
        setExpiration({ hours: undefined, days: undefined })
        setExpirationDate(null)
      }
    }
  }, [opened])

  const {
    data: newTokenData,
    mutate: createWorkspaceToken,
    isLoading,
    error,
    reset,
  } = useCreateWorkspaceToken()

  const handleCreateToken = () => {
    const permissionsObj = convertToPermissionsObject(permissions)

    if (Object.keys(permissionsObj).length === 0) {
      return
    }

    createWorkspaceToken(
      {
        workspaceId,
        data: {
          name,
          expiration: expiration ?? undefined,
          permissions: permissionsObj,
        },
      },
      {
        onSuccess: ({ id, token }) => {
          const newTokenData: WorkspaceToken = {
            id,
            name,
            revoked: false,
            last5: token?.slice(-5),
            permissions: permissionsObj,
            createdAt: dayjs().toDate().toString(),
            expiresAt: expirationDate ? expirationDate.toDate().toString() : null,
          }
          onSuccess(newTokenData)
        },
      }
    )
  }

  return (
    <div>
      <DialogComponent
        title="Create workspace token"
        opened={opened}
        onClose={onClose}
        error={error ? tokensErrorMsgFromCode(error?.code) : undefined}
        onSubmit={handleCreateToken}
        submit={
          !newTokenData
            ? {
                wFull: true,
                text: !isLoading ? 'Create' : 'Creating...',
                disabled: isLoading || name?.trim().length === 0 || !isAtLeastOneChecked(),
              }
            : undefined
        }
        descriptionComponent={
          !newTokenData ? (
            'With cli token you can run commands on behalf of tou account against your workspace from the cli.'
          ) : (
            <div className="text-red-600 dark:text-red-700">
              Please copy this token and store it safely, due to security reasons you will not be
              able to see it again.
            </div>
          )
        }
        loading={isLoading}
      >
        {newTokenData && (
          <div className="mt-0 -mb-5 flex flex-col gap-2">
            <div className="text-green-600 text-[0.93rem]">Token successfully created</div>
            <div className="flex items-center gap-2">
              <Input autoFocus={false} readOnly value={newTokenData?.token} />

              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(newTokenData?.token)
                  setCopied(true)
                }}
              >
                {copied ? (
                  <Icons.check className="h-4 w-4 text-green-600 dark:text-green-600" />
                ) : (
                  <Icons.copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {!newTokenData && (
          <div className="mt-0 mb-3 flex flex-col gap-4">
            <Input
              className="w-full"
              placeholder="Name"
              value={name}
              disabled={isLoading}
              onChange={(e) => setName(e?.target?.value)}
            />
            {/* // */}
            <div className="mt-0">
              <span className="font-semibold text-[0.93rem]">
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[0.93rem]">Expiration</span>
                    <Checkbox
                      id={'exp'}
                      disabled={isLoading}
                      checked={expiration === null ? false : true}
                      onCheckedChange={(e) => setExpiration(e ? { days: 12, hours: 0 } : null)}
                    />
                  </div>
                  <div className="font-normal text-sm text-muted-foreground">Days/hours</div>
                </div>
              </span>
              {/* // */}
              <div className="mt-2 flex flex-row gap-2">
                <div className="flex flex-col gap-2">
                  {/* <Label>Days</Label> */}
                  <Input
                    min={0}
                    max={1830}
                    className="w-full"
                    placeholder="days"
                    type="number"
                    value={expiration?.days}
                    disabled={expiration === null || isLoading}
                    onChange={(e) => {
                      let n = Number(e.target.value)
                      if (n === 0 && expiration?.hours === 0) {
                        setExpiration(null)
                      } else {
                        setExpiration((draft) => {
                          if (draft) {
                            draft.days = n
                          }
                        })
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  {/* <Label>Hours</Label> */}
                  <Input
                    min={0}
                    max={3600}
                    className="w-full"
                    placeholder="hours"
                    type="number"
                    value={expiration?.hours}
                    disabled={expiration === null || isLoading}
                    onChange={(e) => {
                      let n = Number(e.target.value)
                      if (n === 0 && expiration?.days === 0) {
                        setExpiration(null)
                      } else {
                        setExpiration((draft) => {
                          if (draft) {
                            draft.hours = n
                          }
                        })
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            {/* // */}
            {expirationDate && (
              <div className="text-sm flex gap-2 items-center">
                <div className="font-semibold">Expires at:</div>
                <div>{expirationDate.format('YYYY-MM-DD HH:mm (dd)')}</div>
              </div>
            )}

            {/* // */}
            <div className="px-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Permissions</span>

                <div className="h-full mr-1 ease duration-300">
                  <button
                    className={clsx(['text-sm text-muted-foreground'], {
                      'hover:text-foreground': !isLoading,
                    })}
                    disabled={isLoading}
                    onClick={() => {
                      setPermissions((draft) => {
                        draft.forEach((entity) => {
                          entity.permissions.forEach((permission) => {
                            permission.checked = allPermissionsSelected() ? false : true
                          })
                        })
                      })
                    }}
                  >
                    {!allPermissionsSelected() ? 'Select all' : 'Deselect all'}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4 md:gap-4 px-2">
                {permissions.map((g, arrIndex) => (
                  <>
                    <div className="flex flex-col gap-3 md:gap-5">
                      <div className="flex flex-row gap-3">
                        <div className="w-1/3">
                          <div className="text-[0.9rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {g.name}
                          </div>
                        </div>

                        <div className="flex flex-row gap-2.5 md:gap-5 ml-3">
                          {g.permissions.map((grant, index) => (
                            <div
                              className={clsx(['items-center flex space-x-2'], {
                                'cursor-pointer': !isLoading,
                              })}
                              onClick={() => {
                                if (isLoading) return
                                setPermissions((draft) => {
                                  draft[arrIndex].permissions[index].checked =
                                    !draft[arrIndex].permissions[index].checked
                                })
                              }}
                            >
                              <Checkbox
                                id={`${g.name}-${index}`}
                                disabled={isLoading}
                                checked={grant.checked}
                                onCheckedChange={(ch) => {
                                  console.log(ch)
                                  console.log('grant checked', grant.checked)

                                  setPermissions((draft) => {
                                    draft[arrIndex].permissions[index].checked =
                                      !draft[arrIndex].permissions[index].checked
                                  })

                                  // setPermissions((draft) => {
                                  //   if (ch) {
                                  //     draft[arrIndex].permissions[index].checked = true
                                  //   } else {
                                  //     draft[arrIndex].permissions[index].checked = false
                                  //   }
                                  // })
                                }}
                              />
                              <div
                                className={clsx(['grid gap-1.5 leading-none'], {
                                  'cursor-pointer': !isLoading,
                                })}
                              >
                                <label
                                  htmlFor={`${g.name}-${index}`}
                                  className={clsx(
                                    [
                                      'text-[0.9rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                                    ],
                                    {
                                      'cursor-pointer': !isLoading,
                                    }
                                  )}
                                >
                                  {grant.text}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* // */}
                    </div>
                    {arrIndex !== permissions.length - 1 && <Separator className="py-0 -my-0.5 " />}
                  </>
                ))}
                {/* {grantTypes.map((g) => ( */}
                {/*   <div className="items-top flex space-x-3"> */}
                {/*     <Checkbox */}
                {/*       id={g.toString()} */}
                {/*       disabled={isLoading} */}
                {/*       checked={grant[g.toString() as 'Read' | 'Write'] ?? false} */}
                {/*       onCheckedChange={(ch) => { */}
                {/*         setGrant((draft) => { */}
                {/*           let grant = g as 'Read' | 'Write' */}
                {/**/}
                {/*           if (ch) { */}
                {/*             draft[grant] = true */}
                {/*           } else { */}
                {/*             draft[grant] = false */}
                {/*           } */}
                {/*         }) */}
                {/*       }} */}
                {/*     /> */}
                {/*     <div className="grid gap-1.5 leading-none"> */}
                {/*       <label */}
                {/*         htmlFor={g.toString()} */}
                {/*         className="text-[0.9rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" */}
                {/*       > */}
                {/*         {g} */}
                {/*       </label> */}
                {/*     </div> */}
                {/*   </div> */}
                {/* ))} */}
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {tokensErrorMsgFromCode(error?.code) ?? 'Something went wrong'}
              </div>
            )}
            {/* // */}
          </div>
        )}
      </DialogComponent>
    </div>
  )
}
