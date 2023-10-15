'use client'

import { useState } from 'react'

import clsx from 'clsx'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { SecretsChange } from '@/types/envChangelog'
import { useGetEnvChangelogItemSecrets } from '@/api/queries/envChangelog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import ChangelogLayout from './ChangelogLayout'

interface Props {
  workspaceId: string
  projectName: string
  envName: string
  changeId: string
  valuesLoaded: boolean

  //
  changes: SecretsChange[]
  createdAt: string
  onRollback: () => void
  onValuesLoaded: (values: SecretsChange[]) => void
  onError: () => void
}

const ChangelogSecretsItem: React.FC<Props> = ({
  workspaceId,
  projectName,
  envName,
  changeId,
  valuesLoaded,

  changes,
  createdAt,
  onError,
  onRollback,
  onValuesLoaded,
}) => {
  const [hidden, setHidden] = useState(true)
  // const toggleHide = () => setHidden(!hidden)

  const { refetch, isFetching } = useGetEnvChangelogItemSecrets(
    {
      workspaceId,
      projectName,
      envName,
      changeId,
    },
    {
      onSuccess: (data) => {
        onValuesLoaded(data)
        setHidden(false)
      },
      onError,
      enabled: false,
      staleTime: Infinity,
    }
  )

  const toggleHide = () => {
    if (valuesLoaded) {
      setHidden(!hidden)
    } else {
      refetch()
    }
  }

  return (
    <>
      <ChangelogLayout
        createdAt={createdAt}
        titleComponent={
          <div className="flex gap-2 items-center flex-wrap">
            <div>
              <span>Modified secrets</span>
            </div>
            <Icons.asterisk className="hidden md:block w-4 h-4 text-foreground opacity-80 -mt-0.5" />
          </div>
        }
        rollbackBtn={{ onClick: onRollback, disabled: isFetching }}
        showBtn={{
          hidden,
          loading: isFetching,
          onClick: toggleHide,
        }}
      >
        <div className="rounded-md border border-input flex flex-col gap-0">
          {changes?.map(({ secretKey, newValue, oldValue }, index) => (
            <>
              <div
                className={clsx(['w-full bg-red-400X text-sm h-fit py-2 md:py-0 md:h-10'], {
                  'border-b border-input': index !== changes?.length - 1,
                })}
              >
                <div className="flex flex-col w-full md:flex-row gap-0 md:gap-2 md:items-center h-full">
                  <div
                    className={clsx([
                      'w-full md:w-[37%] xl:w-[35%] h-9 md:h-full flex gap-3.5 pl-3.5 pr-1.5 items-center',
                    ])}
                  >
                    <input
                      readOnly
                      className="w-full h-full opacity-100 font-semibold outline-none bg-transparent"
                      value={secretKey}
                    />
                  </div>

                  <div className="flex flex-row gap-3.5 md:gap-0 flex-grow h-full">
                    {oldValue !== null && (
                      <div
                        className={clsx(['w-full h-10 md:h-full flex gap-3.5 items-center'], {
                          'md:w-2/2 pr-2.5': newValue === null,
                          'md:w-1/2 pr-1': newValue !== null,
                        })}
                      >
                        <div className="px-2.5 h-full flex justify-center items-center md:bg-red-600/5 md:dark:bg-red-600/10 md:border-red-600/40 md:dark:border-red-600/20 border-r-[1.5px] md:border-x-[1.5px] ">
                          <Icons.minus className="opacity-70 h-3.5 w-3.5 text-red-600" />
                        </div>

                        {hidden ? (
                          <span className="block opacity-85">•••••••••••</span>
                        ) : (
                          <input
                            readOnly
                            className={clsx(
                              [
                                'w-full h-full text-red-600 dark:text-red-600/80 outline-none bg-transparent',
                              ],
                              {
                                'opacity-100 italic placeholder:text-red-600 placeholder:dark:text-red-600/80':
                                  oldValue === '',
                              }
                            )}
                            placeholder="empty string"
                            value={oldValue === '' ? undefined : oldValue}
                          />
                        )}
                      </div>
                    )}

                    {newValue !== null && (
                      <div
                        className={clsx(
                          ['w-full pr-2.5 h-10 md:h-full flex  gap-3.5 items-center'],
                          {
                            'md:w-2/2': oldValue === null,
                            'md:w-1/2 ': oldValue !== null,
                          }
                        )}
                      >
                        <div className="px-2.5 h-full flex justify-center items-center md:bg-green-600/5 md:dark:bg-green-600/10 md:border-green-600/40 md:dark:border-green-600/20 border-r-[1.5px] md:border-x-[1.5px] ">
                          <Icons.plus className="opacity-70 h-3.5 w-3.5 text-green-600" />
                        </div>
                        {hidden ? (
                          <span className="block opacity-85">•••••••••••</span>
                        ) : (
                          <input
                            readOnly
                            className={clsx(
                              [
                                'w-full text-green-600 dark:text-green-600/90 outline-none bg-transparent',
                              ],
                              {
                                'opacity-100 italic placeholder:text-green-600 placeholder:dark:text-green-600/80':
                                  newValue === '',
                              }
                            )}
                            placeholder="empty string"
                            value={newValue === '' ? undefined : newValue}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </ChangelogLayout>
    </>
  )

  return (
    <>
      <div>
        <div className="w-full flex justify-between items-center gap-3">
          <div className="flex flex-row gap-5 bg-red-400X items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0">
              <div>
                <div className="font-bold text-[0.97rem]">dimak00</div>
                <div className="-mt-0.5 text-[0.97rem] text-muted-foreground">Modified secrets</div>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger disabled>
                  <Button
                    size={'sm'}
                    variant={'ghost'}
                    disabled={isFetching}
                    className={clsx([
                      'opacity-80 hover:opacity-100',
                      {
                        'cursor-default': isFetching,
                      },
                    ])}
                    onClick={onRollback}
                  >
                    <Icons.undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Revert this change</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger disabled={true}>
                  <Button
                    size={'sm'}
                    variant={'ghost'}
                    loading={isFetching}
                    className={clsx(['opacity-80 hover:opacity-100 flex gap-0 '], {
                      'text-primary hover:text-primary opacity-100 cursor-default hover:bg-transparent':
                        isFetching,
                    })}
                    onClick={() => toggleHide()}
                  >
                    {!isFetching && (
                      <>
                        {hidden ? (
                          <Icons.eye className="h-4 w-4" />
                        ) : (
                          <Icons.eyeOff className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{hidden ? 'Show values' : 'Hide values'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {/* // Secrets changes */}
        <div className="md:ml-[3.75rem] bg-red-400x mt-4 md:mt-2.5">
          <div className="rounded-md border border-input flex flex-col gap-0">
            {changes?.map(({ secretKey, newValue, oldValue }, index) => (
              <>
                <div
                  className={clsx(['w-full bg-red-400X text-sm h-fit py-2 md:py-0 md:h-10'], {
                    'border-b border-input': index !== changes?.length - 1,
                  })}
                >
                  <div className="flex flex-col w-full md:flex-row gap-0 md:gap-2 md:items-center h-full">
                    <div
                      className={clsx(
                        [
                          'w-full md:w-[37%] xl:w-[35%] h-9 md:h-full flex gap-3.5 pl-3.5 pr-1.5 items-center',
                        ]
                        //   {
                        //     'md:w-1/2':
                        //       (oldValue !== null && newValue === null) ||
                        //       (oldValue === null && newValue !== null),
                        //     'md:w-1/3': !(
                        //       (oldValue !== null && newValue === null) ||
                        //       (oldValue === null && newValue !== null)
                        //     ),
                        //   }
                      )}
                    >
                      <input
                        readOnly
                        className="w-full h-full opacity-100 font-semibold outline-none bg-transparent"
                        value={secretKey}
                      />
                    </div>

                    <div className="flex flex-row gap-3.5 md:gap-0 flex-grow h-full">
                      {oldValue !== null && (
                        <div
                          className={clsx(['w-full h-10 md:h-full flex gap-3.5 items-center'], {
                            'md:w-2/2 pr-2.5': newValue === null,
                            'md:w-1/2 pr-1': newValue !== null,
                          })}
                        >
                          <div className="px-2.5 h-full flex justify-center items-center md:bg-red-600/5 md:dark:bg-red-600/10 md:border-red-600/40 md:dark:border-red-600/20 border-r-[1.5px] md:border-x-[1.5px] ">
                            <Icons.minus className="opacity-70 h-3.5 w-3.5 text-red-600" />
                          </div>

                          {hidden ? (
                            <span className="block opacity-85">•••••••••••</span>
                          ) : (
                            <input
                              readOnly
                              className={clsx(
                                [
                                  'w-full h-full text-red-600 dark:text-red-600/80 outline-none bg-transparent',
                                ],
                                {
                                  'opacity-100 italic placeholder:text-red-600 placeholder:dark:text-red-600/80':
                                    oldValue === '',
                                }
                              )}
                              placeholder="empty string"
                              value={oldValue === '' ? undefined : oldValue}
                            />
                          )}
                        </div>
                      )}

                      {newValue !== null && (
                        <div
                          className={clsx(
                            ['w-full pr-2.5 h-10 md:h-full flex  gap-3.5 items-center'],
                            {
                              'md:w-2/2': oldValue === null,
                              'md:w-1/2 ': oldValue !== null,
                            }
                          )}
                        >
                          <div className="px-2.5 h-full flex justify-center items-center md:bg-green-600/5 md:dark:bg-green-600/10 md:border-green-600/40 md:dark:border-green-600/20 border-r-[1.5px] md:border-x-[1.5px] ">
                            <Icons.plus className="opacity-70 h-3.5 w-3.5 text-green-600" />
                          </div>
                          {hidden ? (
                            <span className="block opacity-85">•••••••••••</span>
                          ) : (
                            <input
                              readOnly
                              className={clsx(
                                [
                                  'w-full text-green-600 dark:text-green-600/90 outline-none bg-transparent',
                                ],
                                {
                                  'opacity-100 italic placeholder:text-green-600 placeholder:dark:text-green-600/80':
                                    newValue === '',
                                }
                              )}
                              placeholder="empty string"
                              value={newValue === '' ? undefined : newValue}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>

          <div className="mt-3">
            <div className="flex items-center text-[0.90rem] opacity-85">
              <span className="block ml-0.5 text-muted-foreground opacity-100">{createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChangelogSecretsItem
