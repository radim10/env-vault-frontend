import { Icons } from '@/components/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import clsx from 'clsx'

interface Props {
  createdAt: string
  children?: React.ReactNode
  titleComponent?: React.ReactNode
  title?: string

  user?: {
    name: string
    avatarUrl: string | null
  }

  rollbackBtn?: {
    disabled?: boolean
    onClick: () => void
  }
  showBtn?: {
    hidden: boolean
    loading?: boolean
    onClick: () => void
  }
}

const ChangelogLayout: React.FC<Props> = ({
  createdAt,
  user,
  title,
  titleComponent,
  children,
  rollbackBtn,
  showBtn,
}) => {
  return (
    <div>
      <div>
        <div className="w-full flex justify-between items-center gap-3">
          <div className="flex flex-row gap-5 bg-red-400X items-center">
            {user && (
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatarUrl as any} />
                <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            {!user && (
              <div className="w-10 h-10 flex justify-center items-center border-muted border-2 rounded-full">
                <Icons.curlyBraces className="h-4 w-4 opacity-80" />
              </div>
            )}

            <div className="flex flex-col gap-0">
              <div>
                {user && <div className="font-bold text-[0.97rem]">dimak00</div>}
                {/* {!user && <div className="font-bold text-[1.97rem] opacity-70">-------</div>} */}
                {title && (
                  <div className="-mt-0.5 text-[0.97rem] text-muted-foregroundX">{title}</div>
                )}

                {titleComponent && (
                  <div className="-mt-0.5 text-[0.97rem] text-muted-foregroundX">
                    {titleComponent}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 items-center">
            <TooltipProvider>
              {rollbackBtn && (
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size={'sm'}
                      variant={'ghost'}
                      disabled={rollbackBtn?.disabled}
                      className={clsx([
                        'opacity-80 hover:opacity-100',
                        {
                          'cursor-default': rollbackBtn?.disabled,
                        },
                      ])}
                      onClick={rollbackBtn?.onClick}
                    >
                      <Icons.undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Revert this change</TooltipContent>
                </Tooltip>
              )}

              {showBtn && (
                <Tooltip>
                  <TooltipTrigger disabled={false}>
                    <Button
                      size={'sm'}
                      variant={'ghost'}
                      loading={showBtn?.loading}
                      className={clsx(['opacity-80 hover:opacity-100 flex gap-0 '], {
                        'text-primary hover:text-primary opacity-100 cursor-default hover:bg-transparent':
                          showBtn?.loading,
                      })}
                      onClick={showBtn?.onClick}
                    >
                      {!showBtn?.loading && (
                        <>
                          {showBtn?.hidden ? (
                            <Icons.eye className="h-4 w-4" />
                          ) : (
                            <Icons.eyeOff className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{showBtn?.hidden ? 'Show values' : 'Hide values'}</TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </div>
        {/* // Secrets changes */}
        <div
          className={clsx(['md:ml-[3.75rem] bg-red-400x mt-4'], {
            'md:mt-2.5': children,
            'md:mt-0': !children,
          })}
        >
          <div className="">{children && children}</div>

          <div
            className={clsx(['flex items-center gap-2 text-muted-foreground text-[0.90rem]'], {
              'mt-2 -ml-0.5': children !== undefined,
              '-mt-1 -ml-0.5': !children,
            })}
          >
            <div className="">
              <span className="block ml-0.5">{createdAt}</span>
            </div>
            {!user && (
              <>
                <div className="bg-muted-foreground h-[3.5px] w-[3.5px] rounded-full opacity-70" />
                <div className="">
                  <span>sdk</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangelogLayout
