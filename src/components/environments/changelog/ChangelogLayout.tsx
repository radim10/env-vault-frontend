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
    avatar: string
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
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0">
              <div>
                <div className="font-bold text-[0.97rem]">dimak00</div>
                {title && (
                  <div className="-mt-0.5 text-[0.97rem] text-muted-foreground">
                    Modified secrets
                  </div>
                )}

                {titleComponent && (
                  <div className="-mt-0.5 text-[0.97rem] text-muted-foreground">
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
                  <TooltipTrigger disabled>
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
                  <TooltipTrigger disabled={true}>
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
        <div className="md:ml-[3.75rem] bg-red-400x mt-4 md:mt-2.5">
          <div className="">{children && children}</div>

          <div className={clsx({ 'mt-3': children !== undefined })}>
            <div className="flex items-center text-[0.90rem] opacity-85">
              <span className="block ml-0.5 text-muted-foreground">{createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangelogLayout
