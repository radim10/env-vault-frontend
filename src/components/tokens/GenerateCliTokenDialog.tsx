import React, { useState } from 'react'
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
import { useCreateCliToken } from '@/api/mutations/tokens/cli'
import { Input } from '../ui/input'
import { useUpdateEffect } from 'react-use'
import { cliTokensErrorMsgFromCode } from '@/api/requests/tokens/cli'

interface Props {
  opened: boolean
  workspaceId: string

  onClose: () => void
  onSuccess: (args: { id: string; value: string; name: string }) => void
}

const CreateCliTokenDialog: React.FC<Props> = ({ workspaceId, opened, onClose, onSuccess }) => {
  const [name, setName] = useState('')

  const {
    mutate: createToken,
    isLoading,
    error,
  } = useCreateCliToken({
    onSuccess: (data) => onSuccess({ ...data, name }),
  })

  useUpdateEffect(() => {
    if (opened && name !== '') setName('')
  }, [opened])

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
            <DialogTitle>Generate new token</DialogTitle>
            <DialogDescription>
              With cli token you can run commands against your workspace from the cli.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Token name"
            disabled={isLoading}
            className="mt-0"
          />

          {error && (
            <div className="flex flex-col gap-4 mt-3 pb-1">
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {cliTokensErrorMsgFromCode(error?.code) ?? 'Something went wrong'}
              </div>
            </div>
          )}
          <DialogFooter className="mt-2">
            <Button
              type="submit"
              variant="default"
              className="w-full gap-2"
              loading={isLoading}
              disabled={isLoading || name?.trim().length === 0}
              onClick={() => {
                createToken({ workspaceId, name })
              }}
            >
              <span>Generate</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateCliTokenDialog
