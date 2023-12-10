import { useState } from 'react'
import DangerZone from '../DangerZone'
import DeleteAccountDialog from './DeleteAccountDialog'

const DeleteAccount = () => {
  const [deleteDialogOpened, setDeleteDialogOpened] = useState<boolean | null>(null)

  const closeDialog = () => {
    if (!deleteDialogOpened) return

    setDeleteDialogOpened(false)
    setTimeout(() => {
      setDeleteDialogOpened(null)
    }, 150)
  }

  return (
    <>
      {deleteDialogOpened !== null && (
        <DeleteAccountDialog
          opened={deleteDialogOpened === true}
          onClose={closeDialog}
          onSuccess={() => {}}
        />
      )}
      <DangerZone
        btn={{
          onClick: () => setDeleteDialogOpened(true),
          disabled: false,
        }}
        title="Delete my account"
        description="Permanently delete this account, cannot be undone"
      />
    </>
  )
}

export default DeleteAccount
