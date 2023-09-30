import React, { useState } from 'react'
import { useRevokeEnvironmentToken } from '@/api/mutations/envTokens'
import { Icons } from '@/components/icons'
import DeleteDialog from '@/components/DeleteDialog'
import { Input } from '@/components/ui/input'

interface Props {
  opened: boolean

  workspaceId: string
  projectName: string
  envName: string
  tokenName: string
  tokenId: string

  onClose: () => void
  onSuccess: () => void
}

const RevokeTokenDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  envName,
  tokenId,
  tokenName,
  opened,
  onClose,
  onSuccess,
}) => {
  const [confirmText, setConfirmText] = useState('')

  const {
    mutate: revokeToken,
    isLoading,
    error,
  } = useRevokeEnvironmentToken({
    onSuccess: () => onSuccess(),
  })

  return (
    <div>
      <DeleteDialog
        opened={opened}
        onClose={onClose}
        inProgress={isLoading}
        disabledConfirm={confirmText !== tokenName}
        title="Revoke this token?"
        description="If you revoke this token, you will no longer have access to this environment using this token in your applications."
        onConfirm={() => revokeToken({ workspaceId, projectName, envName, tokenId })}
      >
        <div className="flex flex-col gap-4 p0-4 pb-4">
          <div className="flex flex-col gap-1 mt-3">
            <div className="text-[0.92rem]">
              Type <span className="font-bold text-red-600">{tokenName}</span> to confirm this
              action.
            </div>

            <Input
              placeholder={tokenName}
              disabled={isLoading}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>

          {error?.message && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 -mt-1">
              <Icons.xCircle className="h-4 w-4" />
              {error?.message}
            </div>
          )}
        </div>
      </DeleteDialog>
    </div>
  )
}

export default RevokeTokenDialog
