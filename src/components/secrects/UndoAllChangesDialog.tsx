import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '../ui/button'

interface Props {
  opened: boolean
  changeCount: number
  onClose: () => void
  onConfirm: () => void
}

const UndoAllChangesDialog: React.FC<Props> = ({ opened, changeCount, onClose, onConfirm }) => {
  return (
    <div>
      <AlertDialog open={opened}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm undo all</AlertDialogTitle>
            <AlertDialogDescription>
              {`Do you really want to undo ${changeCount} ${
                changeCount === 1 ? 'change' : 'changes'
              }?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </AlertDialogCancel>
            {/* <AlertDialogAction asChild> */}
            <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
            {/* </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UndoAllChangesDialog
