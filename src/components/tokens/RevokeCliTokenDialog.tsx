import React from 'react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRevokeCliToken } from '@/api/mutations/tokens/cli'
import { cliTokensErrorMsgFromCode } from '@/api/requests/tokens/cli'

interface Props {
  opened: boolean

  workspaceId: string
  tokenId: string

  onClose: () => void
  onSuccess: () => void
}

const RevokeCliTokenDialog: React.FC<Props> = ({
  workspaceId,
  tokenId,
  opened,
  onClose,
  onSuccess,
}) => {
  const {
    mutate: revokeToken,
    isLoading,
    error,
  } = useRevokeCliToken({
    onSuccess: () => onSuccess(),
  })

  const handleClose = () => {
    if (isLoading) return
    onClose()
  }

  return (
    <div>
      <Dialog
        open={opened}
        onOpenChange={(e) => {
          if (!e) handleClose()
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Revoke this cli token?</DialogTitle>
            <DialogDescription>
              If you revoke this token, you will no longer have access to this workspace using this
              token with the cli.
            </DialogDescription>

            {error && (
              <div className="flex flex-col gap-4 mt-5 pb-1">
                <div className="text-red-600 text-[0.92rem] flex items-center gap-2 ">
                  <Icons.xCircle className="h-4 w-4" />
                  {cliTokensErrorMsgFromCode(error?.code) ?? 'Something went wrong'}
                </div>
              </div>
            )}
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              variant="destructive"
              className="w-full gap-2"
              loading={isLoading}
              disabled={isLoading}
              onClick={() => {
                revokeToken({ workspaceId, tokenId })
              }}
            >
              <span>Revoke</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RevokeCliTokenDialog
