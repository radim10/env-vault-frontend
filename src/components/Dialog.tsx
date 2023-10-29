import { cn } from '@/lib/utils'
import { Icons } from './icons'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import clsx from 'clsx'
import { LucideIcon } from 'lucide-react'

interface Props {
  opened: boolean
  title: string
  description?: string
  descriptionComponent?: React.ReactNode
  children?: React.ReactNode
  loading?: boolean
  error?: string
  className?: string

  submit?: {
    text: string
    icon?: LucideIcon
    disabled?: boolean
    wFull?: boolean
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'ghost'
    className?: string
  }

  onClose: () => void
  onSubmit: () => void
}

const DialogComponent: React.FC<Props> = ({
  opened,
  title,
  children,
  descriptionComponent,
  loading,
  error,
  description,
  className,
  submit,
  onClose,
  onSubmit,
}) => {
  return (
    <Dialog
      open={opened}
      onOpenChange={(e) => {
        if (!e && !loading) onClose()
      }}
    >
      <DialogContent className={cn('sm:max-w-[425px]', className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          {descriptionComponent && <DialogDescription>{descriptionComponent}</DialogDescription>}
        </DialogHeader>

        {children && children}

        {error && (
          <div className="">
            <div className="text-red-600 text-[0.92rem] py-2 flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        )}
        <DialogFooter className="mt-1">
          {submit && (
            <Button
              type="submit"
              className={cn(
                clsx({ 'w-full': submit.wFull, 'gap-2': submit.icon && !loading }),
                submit.className
              )}
              variant={submit.variant}
              loading={loading}
              disabled={loading || submit.disabled}
              onClick={onSubmit}
            >
              {submit.icon && !loading && <submit.icon className="h-4 w-4" />}
              {submit.text}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogComponent
