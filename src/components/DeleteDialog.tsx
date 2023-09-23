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
import { Loader2 } from 'lucide-react'
import { Icons } from './icons'

interface Props {
  opened: boolean
  inProgress: boolean
  children?: React.ReactNode
  title?: string
  description?: string
  descriptionComponent?: React.ReactNode
  disabledConfirm?: boolean
  onClose: () => void
  onConfirm: () => void
}

const DeleteDialog: React.FC<Props> = ({
  opened,
  title,
  children,
  inProgress,
  description,
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
            <AlertDialogTitle>
              <span>{title ? title : 'Are you absolutely sure?'}</span>
            </AlertDialogTitle>

            {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
            {descriptionComponent && (
              <div className="text-sm text-muted-foreground">{descriptionComponent}</div>
            )}
            {children && <div className="">{children}</div>}
          </AlertDialogHeader>
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
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DeleteDialog
