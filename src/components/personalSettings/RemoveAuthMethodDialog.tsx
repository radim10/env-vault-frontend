import clsx from 'clsx'
import { Icons } from '../icons'
import { Input } from '../ui/input'
import { useImmer } from 'use-immer'
import { AuthType } from '@/types/auth'
import DeleteDialog from '../DeleteDialog'
import { useUpdateEffect } from 'react-use'
import { userAuthErrorMsgFromCode } from '@/api/requests/userAuth'
import { useRemoveAccountAuthMethod } from '@/api/mutations/userAuth'

interface Props {
  opened: boolean
  method: AuthType
  onClose: () => void
  onSuccess: () => void
}

const RemoveAuthMethodDialog: React.FC<Props> = ({ method, opened, onClose, onSuccess }) => {
  const [password, setPassword] = useImmer<{
    value: string
    visible: boolean
  }>({
    value: '',
    visible: false,
  })

  const { mutate, isLoading, error, reset } = useRemoveAccountAuthMethod({
    onSuccess: () => onSuccess(),
  })

  useUpdateEffect(() => {
    if (!opened && error) {
      setTimeout(() => reset(), 150)
    }
  }, [opened])

  return (
    <>
      <DeleteDialog
        opened={opened}
        onClose={onClose}
        title={method === AuthType.EMAIL ? 'Disable email auth' : 'Unlink auth provider'}
        icon={Icons.circleSlash}
        inProgress={isLoading}
        onConfirm={() => {
          if (method === 'EMAIL') {
            mutate({ method, password: password.value })
          } else mutate({ method })
        }}
      >
        <div className="flex flex-col gap-4 p0-4 pb-4">
          <div className="text-[0.92rem]">
            {method == 'EMAIL' &&
              'Are you sure you want to disable email auth? You will be able to login with only Google or Github. Your current password be deleted.'}
            {method == 'GOOGLE' && 'Are you sure you want to unlink Google account?'}
            {method == 'GITHUB' && 'Are you sure you want to unlink Github account?'}
          </div>

          {method === 'EMAIL' && (
            <div className="w-full flex justify-end items-center relative">
              <Input
                disabled={isLoading}
                type={password.visible ? 'text' : 'password'}
                placeholder="Confirm with your password"
                className="pr-10"
                value={password.value}
                onChange={(e) =>
                  setPassword((draft) => {
                    draft.value = e.target.value
                  })
                }
              />
              <button
                disabled={password?.value?.length === 0}
                className={clsx(
                  [
                    'absolute ease duration-200 w-8 h-8 mr-2 flex justify-center items-center gap-2 md:gap-3.5',
                  ],
                  {
                    'opacity-50': password?.value?.length === 0,
                    'cursor-pointer hover:text-primary': password?.value?.length !== 0,
                  }
                )}
                onClick={() =>
                  setPassword((draft) => {
                    draft.visible = !draft.visible
                  })
                }
              >
                {password?.visible ? (
                  <Icons.eyeOff className="h-4 w-4 opacity-80" />
                ) : (
                  <Icons.eye className="h-4 w-4 opacity-80" />
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
              <Icons.xCircle className="h-4 w-4" />
              {userAuthErrorMsgFromCode(error.code)}
            </div>
          )}
        </div>
      </DeleteDialog>
    </>
  )
}

export default RemoveAuthMethodDialog
