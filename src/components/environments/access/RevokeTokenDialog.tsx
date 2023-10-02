import React, { useState } from 'react'
import { useRevokeEnvironmentToken } from '@/api/mutations/envTokens'
import { Icons } from '@/components/icons'
import DeleteDialog from '@/components/DeleteDialog'
import { Input } from '@/components/ui/input'
import { useRevokeWorkspaceToken } from '@/api/mutations/tokens'
import { APIError } from '@/api/instance'
import { useUpdateEffect } from 'react-use'

interface Props {
  opened: boolean

  workspaceId: string
  projectName?: string
  envName?: string
  tokenName: string
  tokenId: string
  description?: string

  onClose: () => void
  onSuccess: () => void
}

const RevokeTokenDialog: React.FC<Props> = ({
  workspaceId,
  projectName,
  envName,
  tokenId,
  tokenName,
  description,
  opened,
  onClose,
  onSuccess,
}) => {
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<APIError<any> | null>(null)

  const {
    mutate: revokeToken,
    isLoading,
    error: err,
  } = useRevokeEnvironmentToken({
    onSuccess: () => onSuccess(),
  })

  const {
    mutate: revokeWorkspaceToken,
    isLoading: isLoading2,
    error: err2,
  } = useRevokeWorkspaceToken({
    onSuccess: () => onSuccess(),
  })

  useUpdateEffect(() => {
    if (isLoading || isLoading2) {
      if (!loading) setLoading(true)
    } else if (!isLoading && !isLoading2 && loading) {
      setLoading(false)
    }
  }, [isLoading, isLoading2])

  useUpdateEffect(() => {
    if (err) setError(err)
    if (err2) setError(err2)

    if (error && !err && !err2) setError(null)
  }, [isLoading, isLoading2])

  return (
    <div>
      <DeleteDialog
        opened={opened}
        onClose={onClose}
        inProgress={loading}
        disabledConfirm={confirmText !== tokenName}
        title="Revoke this token?"
        description={
          description ??
          'If you revoke this token, you will no longer have access to this environment using this token in your applications.'
        }
        onConfirm={() => {
          if (projectName && envName) {
            revokeToken({ workspaceId, projectName, envName, tokenId })
          } else {
            // revoke workspace token
            revokeWorkspaceToken({ workspaceId, tokenId })
          }
        }}
      >
        <div className="flex flex-col gap-4 p0-4 pb-4">
          <div className="flex flex-col gap-1 mt-3">
            <div className="text-[0.92rem]">
              Type <span className="font-bold text-red-600">{tokenName}</span> to confirm this
              action.
            </div>

            <Input
              placeholder={tokenName}
              disabled={loading}
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
