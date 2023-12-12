import { useState } from 'react'
import DangerZone from '../DangerZone'
import DeleteAccountDialog from './DeleteAccountDialog'
import useSessionStore from '@/stores/session'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'

const DeleteAccount = () => {
  const router = useRouter()
  const { toast } = useToast()
  const session = useSessionStore()

  const [deleteDialogOpened, setDeleteDialogOpened] = useState<boolean | null>(null)

  const closeDialog = () => {
    if (!deleteDialogOpened) return

    setDeleteDialogOpened(false)
    setTimeout(() => {
      setDeleteDialogOpened(null)
    }, 150)
  }

  const handleSuccesfulDelete = async () => {
    await session.removeCookie()
    toast({
      variant: 'success',
      title: 'Account deleted',
      description: 'Your account has been permanently deleted',
    })
    router.push('/login')
  }

  return (
    <>
      {deleteDialogOpened !== null && (
        <DeleteAccountDialog
          opened={deleteDialogOpened === true}
          onClose={closeDialog}
          onSuccess={handleSuccesfulDelete}
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
