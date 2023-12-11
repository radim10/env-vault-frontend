import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import clsx from 'clsx'
import { Loader2, LucideIcon } from 'lucide-react'

interface Props {
  opened: boolean
  inProgress: boolean
  children?: React.ReactNode
  title?: string
  hideFooter?: boolean
  icon?: LucideIcon
  description?: string
  descriptionComponent?: React.ReactNode
  disabledConfirm?: boolean
  confirmText?: string
  onClose: () => void
  onConfirm: () => void
}

const DeleteDialog: React.FC<Props> = ({
  opened,
  title,
  icon: Icon,
  children,
  inProgress,
  description,
  hideFooter,
  confirmText,
  disabledConfirm,
  descriptionComponent,
  onClose,
  onConfirm,
}) => {
  return (
    <>
      <AlertDialog open={opened}>
        <AlertDialogTrigger asChild></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className={clsx({
                'flex items-center gap-3': Icon !== undefined,
              })}
            >
              <span>{title ? title : 'Are you absolutely sure?'}</span>
              {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
            </AlertDialogTitle>

            {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
            {descriptionComponent && (
              <div className="text-sm text-muted-foreground">{descriptionComponent}</div>
            )}
            {children && <div className="">{children}</div>}
          </AlertDialogHeader>
          {!hideFooter && (
            <AlertDialogFooter>
              <AlertDialogCancel disabled={inProgress} onClick={onClose}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onConfirm}
                disabled={inProgress || disabledConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {inProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {confirmText ? confirmText : 'Confirm'}
              </AlertDialogAction>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteDialog
