import { useCallback, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useImmer } from 'use-immer'
import { useDebounce, useUpdateEffect } from 'react-use'
import dayjs, { Dayjs } from 'dayjs'
import { useCreateEnvironmentToken } from '@/api/mutations/tokens/environment'
import { Icons } from '@/components/icons'
import { EnvTokenPermission, EnvironmentToken } from '@/types/tokens/environment'
import { envTokensErrorMsgFromCode } from '@/api/requests/projects/environments/tokens'
import clsx from 'clsx'
import DialogComponent from '@/components/Dialog'
import { Separator } from '@/components/ui/separator'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
  readOnly?: boolean

  opened: boolean
  onClose: () => void
  onSuccess: (data: EnvironmentToken) => void
}

export const GenerateEnvTokenDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  envName,
  opened,
  readOnly,
  onClose,
  onSuccess,
}) => {
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [expiration, setExpiration] = useImmer<{
    hours?: number
    days?: number
  } | null>(null)
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null)
  const [permissions, setPermissions] = useImmer([
    {
      name: 'Environment',
      permissions: [
        {
          text: 'Read',
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

  const isAtLeastOneChecked = useCallback(() => {
    return permissions.some((resource) => {
      return resource.permissions.some((permission) => permission.checked)
    })
  }, [permissions])

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

  const {
    data: newTokenData,
    mutate: createEnvironmentToken,
    isLoading,
    error,
    reset,
  } = useCreateEnvironmentToken({
    // onSuccess: ({ id, token }) => {
    // onSuccess({
    //   id,
    //   name,
    //   expiresAt: expirationDate ? expirationDate.toDate().toString() : null,
    //   last5: token?.slice(-5),
    //   revoked: false,
    //   createdAt: dayjs().toDate().toString(),
    //   permissions:
    //     grant.Read && grant.Write
    //       ? EnvTokenPermission.READ_WRITE
    //       : grant.Read
    //       ? EnvTokenPermission.READ
    //       : EnvTokenPermission.WRITE,
    // })
    // },
  })

  useUpdateEffect(() => {
    if (opened && copied) setCopied(false)
  }, [opened])

  useUpdateEffect(() => {
    if (!opened) {
      setTimeout(() => reset(), 150)
      if (name?.length > 0) setName('')

      if (isAtLeastOneChecked()) {
        setPermissions((draft) => {
          draft[1].permissions.forEach((entity) => {
            entity.checked = false
          })
        })
      }

      if (expiration?.hours || expiration?.days) {
        setExpiration({ hours: undefined, days: undefined })
        setExpirationDate(null)
      }
    }
  }, [opened])

  const handleCreateToken = () => {
    let selectedPermissions: EnvTokenPermission[] = []

    permissions[1].permissions.forEach((permission) => {
      if (permission.checked) {
        selectedPermissions.push(permission.text.toLowerCase() as EnvTokenPermission)
      }
    })

    createEnvironmentToken(
      {
        workspaceId,
        projectName,
        envName,
        data: {
          name,
          permissions: selectedPermissions,
          expiration: expiration ?? undefined,
        },
      },
      {
        onSuccess: ({ id, token }) => {
          const tokenData: EnvironmentToken = {
            id,
            name,
            expiresAt: expirationDate ? expirationDate.toDate().toString() : null,
            last5: token?.slice(-5),
            revoked: false,
            createdAt: dayjs().toDate().toString(),
            permissions: selectedPermissions,
          }
          onSuccess(tokenData)
        },
      }
    )
  }

  return (
    <div>
      <div>
        <DialogComponent
          title="Create environment token"
          opened={opened}
          onClose={onClose}
          loading={isLoading}
          error={error ? envTokensErrorMsgFromCode(error?.code) : undefined}
          onSubmit={handleCreateToken}
          submit={
            !newTokenData
              ? {
                  wFull: true,
                  disabled: isLoading || name?.trim().length === 0 || !isAtLeastOneChecked(),
                  text: !isLoading ? 'Create' : 'Creating...',
                }
              : undefined
          }
          description={
            !newTokenData
              ? 'Environment tokens are used with SDKs to access only selected environments.'
              : undefined
          }
          descriptionComponent={
            newTokenData && (
              <div className="text-red-600 dark:text-red-700">
                Please copy this token and store it safely, due to security reasons you will not be
                able to see it again.
              </div>
            )
          }
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
                <span className="font-semibold">Permissions</span>

                <div className="mt-4 flex flex-col gap-4 md:gap-4 px-2">
                  {permissions.map((g, arrIndex) => (
                    <>
                      <div className="flex flex-col gap-3 md:gap-5">
                        <div className="flex flex-row gap-3 items-center">
                          <div className="w-1/3">
                            <div className="text-[0.9rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {g.name}
                            </div>
                          </div>

                          {arrIndex === 0 && (
                            <div className="text-foreground text-[0.9rem]">
                              Read-only by default
                            </div>
                          )}
                          <div className="flex flex-row items-center gap-2.5 md:gap-5 ml-3">
                            {arrIndex !== 0 &&
                              g.permissions.map((grant, index) => (
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
                      {arrIndex !== permissions.length - 1 && (
                        <Separator className="py-0 -my-0.5 " />
                      )}
                    </>
                  ))}
                </div>
              </div>

              {/* <div className="px-0"> */}
              {/*   <span className="font-semibold">Grant</span> */}
              {/**/}
              {/*   <div className="mt-2 flex flex-col gap-2.5 px-2"> */}
              {/*     {grantTypes.map((g, index) => ( */}
              {/*       <div className="items-top flex space-x-3"> */}
              {/*         <Checkbox */}
              {/*           id={g.toString()} */}
              {/*           disabled={isLoading || (readOnly && index === 1)} */}
              {/*           checked={grant[g.toString() as 'Read' | 'Write'] ?? false} */}
              {/*           onCheckedChange={(ch) => { */}
              {/*             setGrant((draft) => { */}
              {/*               let grant = g as 'Read' | 'Write' */}
              {/**/}
              {/*               if (ch) { */}
              {/*                 draft[grant] = true */}
              {/*               } else { */}
              {/*                 draft[grant] = false */}
              {/*               } */}
              {/*             }) */}
              {/*           }} */}
              {/*         /> */}
              {/*         <div className="grid gap-1.5 leading-none"> */}
              {/*           <label */}
              {/*             htmlFor={g.toString()} */}
              {/*             className={clsx( */}
              {/*               [ */}
              {/*                 'text-[0.9rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', */}
              {/*               ], */}
              {/*               { */}
              {/*                 'opacity-50 cursor-not-allowed': readOnly && index === 1, */}
              {/*               } */}
              {/*             )} */}
              {/*           > */}
              {/*             {g} */}
              {/*           </label> */}
              {/*         </div> */}
              {/*       </div> */}
              {/*     ))} */}
              {/*   </div> */}
              {/* </div> */}
            </div>
          )}
        </DialogComponent>

        {/* <Dialog */}
        {/*   open={opened} */}
        {/*   onOpenChange={(e) => { */}
        {/*     if (!e) onClose() */}
        {/*   }} */}
        {/* > */}
        {/*   <DialogContent className="sm:max-w-[425px]"> */}
        {/*     <DialogHeader> */}
        {/*       <DialogTitle>Generate environment token</DialogTitle> */}
        {/*       <DialogDescription> */}
        {/*         Environment tokens are used with SDKs to access only selected environments. */}
        {/*       </DialogDescription> */}
        {/*     </DialogHeader> */}
        {/**/}
        {/*     {newTokenData && ( */}
        {/*       <div className="mt-0 mb-4 flex flex-col gap-2"> */}
        {/*         <div className="text-green-600 text-[0.93rem]">Token successfully created</div> */}
        {/*         <div className="flex items-center gap-2"> */}
        {/*           <Input autoFocus={false} readOnly value={newTokenData?.token} /> */}
        {/**/}
        {/*           <Button */}
        {/*             variant="outline" */}
        {/*             onClick={() => { */}
        {/*               navigator.clipboard.writeText(newTokenData?.token) */}
        {/*               setCopied(true) */}
        {/*             }} */}
        {/*           > */}
        {/*             {copied ? ( */}
        {/*               <Icons.check className="h-4 w-4 text-green-600 dark:text-green-600" /> */}
        {/*             ) : ( */}
        {/*               <Icons.copy className="h-4 w-4" /> */}
        {/*             )} */}
        {/*           </Button> */}
        {/*         </div> */}
        {/*       </div> */}
        {/*     )} */}
        {/*     {!newTokenData && ( */}
        {/*       <div className="mt-2 mb-4 flex flex-col gap-4"> */}
        {/*         <Input */}
        {/*           className="w-full" */}
        {/*           placeholder="Name" */}
        {/*           value={name} */}
        {/*           disabled={isLoading} */}
        {/*           onChange={(e) => setName(e?.target?.value)} */}
        {/*         /> */}
        {/*         {/* // */}
        {/*         <div className="mt-0"> */}
        {/*           <span className="font-semibold text-[0.93rem]"> */}
        {/*             <div className="flex items-center gap-3 justify-between"> */}
        {/*               <div className="flex items-center gap-3"> */}
        {/*                 <span className="font-semibold text-[0.93rem]">Expiration</span> */}
        {/*                 <Checkbox */}
        {/*                   id={'exp'} */}
        {/*                   disabled={isLoading} */}
        {/*                   checked={expiration === null ? false : true} */}
        {/*                   onCheckedChange={(e) => setExpiration(e ? { days: 12, hours: 0 } : null)} */}
        {/*                 /> */}
        {/*               </div> */}
        {/*               <div className="font-normal text-sm text-muted-foreground">Days/hours</div> */}
        {/*             </div> */}
        {/*           </span> */}
        {/*           {/* // */}
        {/*           <div className="mt-2 flex flex-row gap-2"> */}
        {/*             <div className="flex flex-col gap-2"> */}
        {/*               {/* <Label>Days</Label> */}
        {/*               <Input */}
        {/*                 min={0} */}
        {/*                 max={1830} */}
        {/*                 className="w-full" */}
        {/*                 placeholder="days" */}
        {/*                 type="number" */}
        {/*                 value={expiration?.days} */}
        {/*                 disabled={expiration === null || isLoading} */}
        {/*                 onChange={(e) => { */}
        {/*                   let n = Number(e.target.value) */}
        {/*                   if (n === 0 && expiration?.hours === 0) { */}
        {/*                     setExpiration(null) */}
        {/*                   } else { */}
        {/*                     setExpiration((draft) => { */}
        {/*                       if (draft) { */}
        {/*                         draft.days = n */}
        {/*                       } */}
        {/*                     }) */}
        {/*                   } */}
        {/*                 }} */}
        {/*               /> */}
        {/*             </div> */}
        {/*             <div className="flex flex-col gap-2"> */}
        {/*               {/* <Label>Hours</Label> */}
        {/*               <Input */}
        {/*                 min={0} */}
        {/*                 max={3600} */}
        {/*                 className="w-full" */}
        {/*                 placeholder="hours" */}
        {/*                 type="number" */}
        {/*                 value={expiration?.hours} */}
        {/*                 disabled={expiration === null || isLoading} */}
        {/*                 onChange={(e) => { */}
        {/*                   let n = Number(e.target.value) */}
        {/*                   if (n === 0 && expiration?.days === 0) { */}
        {/*                     setExpiration(null) */}
        {/*                   } else { */}
        {/*                     setExpiration((draft) => { */}
        {/*                       if (draft) { */}
        {/*                         draft.hours = n */}
        {/*                       } */}
        {/*                     }) */}
        {/*                   } */}
        {/*                 }} */}
        {/*               /> */}
        {/*             </div> */}
        {/*           </div> */}
        {/*         </div> */}
        {/*         {/* // */}
        {/*         {expirationDate && ( */}
        {/*           <div className="text-sm flex gap-2 items-center"> */}
        {/*             <div className="font-semibold">Expires at:</div> */}
        {/*             <div>{expirationDate.format('YYYY-MM-DD HH:mm (dd)')}</div> */}
        {/*           </div> */}
        {/*         )} */}
        {/**/}
        {/*         {/* // */}
        {/*         <div className="px-0"> */}
        {/*           <span className="font-semibold">Grant</span> */}
        {/**/}
        {/*           <div className="mt-2 flex flex-col gap-2.5 px-2"> */}
        {/*             {grantTypes.map((g, index) => ( */}
        {/*               <div className="items-top flex space-x-3"> */}
        {/*                 <Checkbox */}
        {/*                   id={g.toString()} */}
        {/*                   disabled={isLoading || (readOnly && index === 1)} */}
        {/*                   checked={grant[g.toString() as 'Read' | 'Write'] ?? false} */}
        {/*                   onCheckedChange={(ch) => { */}
        {/*                     setGrant((draft) => { */}
        {/*                       let grant = g as 'Read' | 'Write' */}
        {/**/}
        {/*                       if (ch) { */}
        {/*                         draft[grant] = true */}
        {/*                       } else { */}
        {/*                         draft[grant] = false */}
        {/*                       } */}
        {/*                     }) */}
        {/*                   }} */}
        {/*                 /> */}
        {/*                 <div className="grid gap-1.5 leading-none"> */}
        {/*                   <label */}
        {/*                     htmlFor={g.toString()} */}
        {/*                     className={clsx( */}
        {/*                       [ */}
        {/*                         'text-[0.9rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', */}
        {/*                       ], */}
        {/*                       { */}
        {/*                         'opacity-50 cursor-not-allowed': readOnly && index === 1, */}
        {/*                       } */}
        {/*                     )} */}
        {/*                   > */}
        {/*                     {g} */}
        {/*                   </label> */}
        {/*                 </div> */}
        {/*               </div> */}
        {/*             ))} */}
        {/*           </div> */}
        {/*         </div> */}
        {/**/}
        {/*         {error && ( */}
        {/*           <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0"> */}
        {/*             <Icons.xCircle className="h-4 w-4" /> */}
        {/*             {envTokensErrorMsgFromCode(error?.code) ?? 'Something went wrong'} */}
        {/*           </div> */}
        {/*         )} */}
        {/*         {/* // */}
        {/*       </div> */}
        {/*     )} */}
        {/**/}
        {/*     <DialogFooter> */}
        {/*       {!newTokenData && ( */}
        {/*         <Button */}
        {/*           type="submit" */}
        {/*           disabled={ */}
        {/*             isLoading || name?.trim().length === 0 || (!grant?.Read && !grant?.Write) */}
        {/*           } */}
        {/*           onClick={handleCreateToken} */}
        {/*         > */}
        {/*           Confirm */}
        {/*         </Button> */}
        {/*       )} */}
        {/*       {newTokenData && ( */}
        {/*         <Button type="submit" onClick={() => onClose()} variant="outline"> */}
        {/*           Close */}
        {/*         </Button> */}
        {/*       )} */}
        {/*     </DialogFooter> */}
        {/*   </DialogContent> */}
        {/* </Dialog> */}
      </div>
    </div>
  )
}
