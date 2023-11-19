import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useImmer } from 'use-immer'
import { useDebounce, useUpdateEffect } from 'react-use'
import dayjs, { Dayjs } from 'dayjs'
import { useCreateEnvironmentToken } from '@/api/mutations/tokens/environment'
import { Icons } from '@/components/icons'
import { EnvTokenGrant, EnvironmentToken } from '@/types/tokens/environment'
import { envTokensErrorMsgFromCode } from '@/api/requests/projects/environments/tokens'
import clsx from 'clsx'

enum Grant {
  Read = 'Read',
  Write = 'Write',
  ReadWrite = 'Read/write',
}

const grantTypes: Grant[] = [Grant.Read, Grant.Write]

interface Props {
  workspaceId: string
  projectName: string
  envName: string
  readOnly?: boolean

  opened: boolean
  onClose: () => void
  onSuccess: (data: Omit<EnvironmentToken, 'tokenPreview'> & { fullToken: string }) => void
}

export const GenerateEnvTokenDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  readOnly,
  envName,
  opened,
  onClose,
  onSuccess,
}) => {
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [grant, setGrant] = useImmer<{
    Read: boolean
    Write: boolean
  }>({
    Read: false,
    Write: false,
  })
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

  const {
    data: newTokenData,
    mutate: createEnvironmentToken,
    isLoading,
    error,
    reset,
  } = useCreateEnvironmentToken({
    onSuccess: ({ id, token }) => {
      onSuccess({
        id,
        name,
        expiresAt: expirationDate ? expirationDate.toDate().toString() : null,
        fullToken: token,
        revoked: false,
        createdAt: dayjs().toDate().toString(),
        grant:
          grant.Read && grant.Write
            ? EnvTokenGrant.READ_WRITE
            : grant.Read
            ? EnvTokenGrant.READ_WRITE
            : EnvTokenGrant.WRITE,
      })
    },
  })

  useUpdateEffect(() => {
    if (opened && copied) setCopied(false)
  }, [opened])

  useUpdateEffect(() => {
    if (!opened) {
      setTimeout(() => reset(), 150)
      if (name?.length > 0) setName('')
      if (grant?.Read || grant?.Write) setGrant({ Read: false, Write: false })
      if (expiration?.hours || expiration?.days) {
        setExpiration({ hours: undefined, days: undefined })
        setExpirationDate(null)
      }
    }
  }, [opened])

  const handleCreateToken = () => {
    createEnvironmentToken({
      workspaceId,
      projectName,
      envName,
      data: {
        name,
        grant:
          grant.Read && grant.Write
            ? EnvTokenGrant.READ_WRITE
            : grant.Read
            ? EnvTokenGrant.READ
            : EnvTokenGrant.WRITE,
        expiration: expiration ?? undefined,
      },
    })
  }

  return (
    <div>
      <div>
        <Dialog
          open={opened}
          onOpenChange={(e) => {
            if (!e) onClose()
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate environment token</DialogTitle>
              <DialogDescription>
                Environment tokens are used with SDKs to access only selected environments.
              </DialogDescription>
            </DialogHeader>

            {newTokenData && (
              <div className="mt-0 mb-4 flex flex-col gap-2">
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
              <div className="mt-2 mb-4 flex flex-col gap-4">
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
                  <span className="font-semibold">Grant</span>

                  <div className="mt-2 flex flex-col gap-2.5 px-2">
                    {grantTypes.map((g, index) => (
                      <div className="items-top flex space-x-3">
                        <Checkbox
                          id={g.toString()}
                          disabled={isLoading || (readOnly && index === 1)}
                          checked={grant[g.toString() as 'Read' | 'Write'] ?? false}
                          onCheckedChange={(ch) => {
                            setGrant((draft) => {
                              let grant = g as 'Read' | 'Write'

                              if (ch) {
                                draft[grant] = true
                              } else {
                                draft[grant] = false
                              }
                            })
                          }}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={g.toString()}
                            className={clsx(
                              [
                                'text-[0.9rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                              ],
                              {
                                'opacity-50 cursor-not-allowed': readOnly && index === 1,
                              }
                            )}
                          >
                            {g}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                    <Icons.xCircle className="h-4 w-4" />
                    {envTokensErrorMsgFromCode(error?.code) ?? 'Something went wrong'}
                  </div>
                )}
                {/* // */}
              </div>
            )}

            <DialogFooter>
              {!newTokenData && (
                <Button
                  type="submit"
                  disabled={
                    isLoading || name?.trim().length === 0 || (!grant?.Read && !grant?.Write)
                  }
                  onClick={handleCreateToken}
                >
                  Confirm
                </Button>
              )}
              {newTokenData && (
                <Button type="submit" onClick={() => onClose()} variant="outline">
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
