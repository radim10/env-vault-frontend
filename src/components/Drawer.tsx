import clsx from 'clsx'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Icons } from './icons'
import { Button } from './ui/button'

interface Props {
  opened: boolean
  title: string
  children: React.ReactNode
  className?: string
  description?: string
  isLoading?: boolean
  onClose: () => void
  submit: {
    text: string
    disabled?: boolean
    loading?: boolean
    onSubmit: () => void
  }
}

const Drawer: React.FC<Props> = ({
  opened,
  title,
  children,
  description,
  isLoading,
  className,
  submit,
  onClose,
}) => {
  return (
    <Sheet
      open={opened}
      onOpenChange={(e) => {
        if (!e) onClose()
      }}
    >
      <SheetContent
        className={cn(
          'w-screen sm:w-[500px] md:w-[700px] lg:w-[700px] h-full md:px-8 md:py-4 py-3 px-4',
          className
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          e.preventDefault()
        }}
      >
        <SheetHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <button
                disabled={isLoading}
                onClick={() => onClose()}
                className={clsx(['opacity-70 transition-opacity '], {
                  'opacity-70': isLoading,
                  'hover:opacity-100 cursor-pointer': !isLoading,
                })}
              >
                <Icons.x className="h-4 w-4" />
                {/* <span className="sr-only">Close</span> */}
              </button>

              <SheetTitle className="text-[1.1rem]">{title}</SheetTitle>
            </div>

            <Button
              size={'sm'}
              className="w-fit px-6"
              disabled={submit?.disabled}
              loading={submit?.loading}
              onClick={submit?.onSubmit}
            >
              {submit?.text}
            </Button>
          </div>

          {description && (
            <SheetDescription className="text-[0.95rem]">
              Teams are a way to better organize workspace users and their access.
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="mt-6">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

export default Drawer
