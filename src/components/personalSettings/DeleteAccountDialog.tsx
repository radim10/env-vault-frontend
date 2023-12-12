import { Icons } from '../icons'
import { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import DeleteDialog from '../DeleteDialog'
import { useUpdateEffect } from 'react-use'
import { useDeleteAccount } from '@/api/mutations/currentUser'
import { currentUserErrorMsgFromCode } from '@/api/requests/currentUser'

interface Props {
  opened: boolean
  onClose: () => void
  onSuccess: () => void
}

const DeleteAccountDialog: React.FC<Props> = ({ opened, onClose, onSuccess }) => {
  const [confirmText, setConfirmText] = useState('')
  const [step, setStep] = useState<0 | 1>(0)

  const {
    mutate: deleteAccount,
    isLoading,
    error,
    reset,
  } = useDeleteAccount({
    onSuccess: () => onSuccess(),
  })

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  return (
    <div>
      <DeleteDialog
        opened={opened}
        onClose={onClose}
        inProgress={isLoading}
        hideFooter={step !== 0}
        disabledConfirm={confirmText !== 'Delete account'}
        title="Delete your account?"
        onConfirm={() => setStep(1)}
        descriptionComponent={
          step === 0 && (
            <>
              <span>Permanently delete this account.</span>
              <span> This action is not reversible.</span>
              <span>
                {' '}
                You will be removed from all workspaces where you are only member will be deleted as
                well (with all projects and environments).
              </span>
            </>
          )
        }
      >
        {step === 1 && (
          <div className="flex flex-col gap-2 p0-4 pb-0 mt-2">
            <div className="flex flex-col gap-3">
              <Button
                className="h-20"
                loading={isLoading}
                variant={'destructive'}
                onClick={() => deleteAccount(undefined)}
              >
                {isLoading ? 'Deleting...' : 'Delete account'}
              </Button>

              <Button className="h-20" variant={'outline'} onClick={onClose} disabled={isLoading}>
                Cancel action
              </Button>
            </div>
            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {currentUserErrorMsgFromCode(error.code) ?? 'Something went wrong'}
              </div>
            )}
          </div>
        )}

        {step === 0 && (
          <div className="flex flex-col gap-2 p0-4 pb-4 mt-2">
            <div className="flex flex-col gap-2">
              <div className="text-[0.92rem]">
                Type <span className="font-bold text-red-600">Delete account</span> to confirm this
                action.
              </div>

              <Input
                placeholder={'Delete account'}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 mt-3">
              <div className="text-[0.92rem]">Tell us why you are deleting your account</div>
              <Textarea placeholder={'Optional'} rows={1} />
            </div>
          </div>
        )}
      </DeleteDialog>
    </div>
  )
}

export default DeleteAccountDialog
