'use client'

import clsx from 'clsx'
import { Icons } from '../icons'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useImmer } from 'use-immer'
import PersonalSettingsLayout from './Layout'
import { GetAuthMethodsResData, userAuthErrorMsgFromCode } from '@/api/requests/userAuth'
import { useCreateAccountPassword, useUpdateAccountPassword } from '@/api/mutations/userAuth'
import { useQueryClient } from '@tanstack/react-query'
import useCurrentUserStore from '@/stores/user'
import { Skeleton } from '../ui/skeleton'
import TypographyH4 from '../typography/TypographyH4'
import { AuthType } from '@/types/auth'
import { useToast } from '../ui/use-toast'

const upperCaseRegex = /[A-Z]/
const lowerCaseRegex = /[a-z]/
const numberRegex = /\d/

const passwordRules = [
  {
    name: 'Minimum 10 characters',
    check: (password: string) => password.length >= 10,
  },
  {
    name: 'At least 1 uppercase letter',
    check: (password: string) => upperCaseRegex.test(password),
  },
  {
    name: 'At least 1 lowercase letter',
    check: (password: string) => lowerCaseRegex.test(password),
  },
  {
    name: 'At least 1 number',
    check: (password: string) => numberRegex.test(password),
  },
]

const PasswordSection = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const currentUser = useCurrentUserStore((state) => state.data)

  const authMethods = queryClient.getQueryState<{ methods: AuthType[] }, any>([
    currentUser?.id,
    'auth-methods',
  ])

  const [oldPassword, setOldPassword] = useImmer<{
    value: string
    visible: boolean
  }>({
    value: '',
    visible: false,
  })

  const [password, setPassword] = useImmer<{
    value: string
    visible: boolean
  }>({
    value: '',
    visible: false,
  })

  const [confirmPassword, setConfirmPassword] = useImmer<{
    value: string
    visible: boolean
  }>({
    value: '',
    visible: false,
  })

  const {
    mutate: createAccountPassword,
    isLoading: createAccountPasswordLoading,
    error: createAccountPasswordError,
  } = useCreateAccountPassword({
    onSuccess: () => {
      resetInputState()
      toast({
        title: 'Password created',
        variant: 'success',
      })

      const data = queryClient.getQueryData<GetAuthMethodsResData>([
        currentUser?.id,
        'auth-methods',
      ])

      if (data) {
        const newData = [...data.methods, 'EMAIL'] as AuthType[]
        queryClient.setQueryData<GetAuthMethodsResData>([currentUser?.id, 'auth-methods'], {
          methods: newData,
        })
      }
    },
  })

  const {
    mutate: updateAccountPassword,
    isLoading: updateAccountPasswordLoading,
    error: updateAccountPasswordError,
  } = useUpdateAccountPassword({
    onSuccess: () => {
      resetInputState()
      toast({
        title: 'Password updated',
        variant: 'success',
      })
    },
  })

  const resetInputState = () => {
    setPassword({ value: '', visible: false })
    setOldPassword({ value: '', visible: false })
    setConfirmPassword({ value: '', visible: false })
  }

  const handleCreatePassword = () => {
    createAccountPassword({ password: password.value })
  }

  if (authMethods?.data === undefined) {
    return (
      <div className="rounded-md border-2">
        <div className=" w-full px-3 py-3 md:px-5 md:py-4 md:pb-6">
          <div className="gap-3 flex items-center">
            <TypographyH4>Password</TypographyH4>
            <Icons.squareAsterisk className="h-5 w-5 opacity-80" />
          </div>
          <div className="text-[0.95rem] text-muted-foreground mt-1">
            If you set password you will be able to use it to login
          </div>
        </div>
        <div className="-mt-2">
          {!authMethods?.error && <Skeleton className="h-56 rounded-t-none" />}
          {authMethods?.error && (
            <>
              <div className="h-28 flex flex-row items-center">
                <div className="flex flex-col gap-2 w-full items-center">
                  <div className="text-red-600 text-[0.92rem]">Something went wrong</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PersonalSettingsLayout
        description="If you set password you will be able to use it to login"
        title="Password"
        icon={Icons.squareAsterisk}
      >
        <div className="flex flex-col gap-4 justify-center w-full">
          <div className="md:mb-2 flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3 w-full">
            <div className="md:w-[35%]">
              <Label>Rules</Label>
            </div>
            <div className="flex flex-col gap-1 md:w-1/2">
              {[...passwordRules.slice(0, 2)].map(({ name, check }) => (
                <div
                  className={clsx(['flex gap-2 items-center text-[0.95rem] ease duration-200'], {
                    'text-green-600': check(password?.value),
                    'opacity-50':
                      password?.value?.length === 0 && confirmPassword?.value?.length === 0,
                  })}
                >
                  <Icons.checkCircle2 className="h-4 w-4" />
                  <span>{name}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 md:w-1/2">
              {[...passwordRules.slice(2, 4)].map(({ name, check }) => (
                <div
                  className={clsx(['flex gap-2 items-center text-[0.95rem] ease duration-200'], {
                    'text-green-600': check(password?.value),
                    'opacity-50':
                      password?.value?.length === 0 && confirmPassword?.value?.length === 0,
                  })}
                >
                  <Icons.checkCircle2 className="h-4 w-4" />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {authMethods?.data?.methods?.includes('EMAIL') && (
            <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
              <div className="md:w-[35%]">
                <Label>Current password</Label>
              </div>
              <div className="w-full flex justify-end items-center relative">
                <Input
                  disabled={createAccountPasswordLoading || updateAccountPasswordLoading}
                  type={oldPassword.visible ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  className="pr-10"
                  value={oldPassword.value}
                  onChange={(e) =>
                    setOldPassword((draft) => {
                      draft.value = e.target.value
                    })
                  }
                />
                <button
                  disabled={oldPassword?.value?.length === 0}
                  className={clsx(
                    [
                      'absolute ease duration-200 w-8 h-8 mr-2 flex justify-center items-center gap-2 md:gap-3.5',
                    ],
                    {
                      'opacity-50': oldPassword?.value?.length === 0,
                      'cursor-pointer hover:text-primary': oldPassword?.value?.length !== 0,
                    }
                  )}
                  onClick={() =>
                    setOldPassword((draft) => {
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
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
            <div className="md:w-[35%]">
              <Label>
                {authMethods?.data?.methods?.includes('EMAIL') ? 'New Password' : 'Password'}
              </Label>
            </div>
            <div className="w-full flex justify-end items-center relative">
              <Input
                disabled={createAccountPasswordLoading || updateAccountPasswordLoading}
                type={password.visible ? 'text' : 'password'}
                placeholder={
                  authMethods?.data?.methods?.includes('EMAIL')
                    ? 'Enter your new password'
                    : 'Enter your password'
                }
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
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
            <div className="md:w-[35%]">
              <Label>Confirm password</Label>
            </div>
            <div className="w-full flex justify-end items-center relative">
              <Input
                disabled={createAccountPasswordLoading || updateAccountPasswordLoading}
                type={confirmPassword.visible ? 'text' : 'password'}
                placeholder={
                  authMethods?.data?.methods?.includes('EMAIL')
                    ? 'Enter your new password again'
                    : 'Enter your password again'
                }
                value={confirmPassword.value}
                onChange={(e) =>
                  setConfirmPassword((draft) => {
                    draft.value = e.target.value
                  })
                }
              />

              <button
                disabled={password?.value?.length === 0}
                className={clsx(
                  [
                    ' absolute ease duration-200 w-8 h-8 mr-2 flex justify-center items-center gap-2 md:gap-3.5',
                  ],
                  {
                    'opacity-50': confirmPassword?.value?.length === 0,
                    'cursor-pointer hover:text-primary ': confirmPassword?.value?.length !== 0,
                  }
                )}
                onClick={() =>
                  setConfirmPassword((draft) => {
                    draft.visible = !draft.visible
                  })
                }
              >
                {confirmPassword?.visible ? (
                  <Icons.eyeOff className="h-4 w-4 opacity-80" />
                ) : (
                  <Icons.eye className="h-4 w-4 opacity-80" />
                )}
              </button>
            </div>
          </div>

          {createAccountPasswordError && (
            <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0 md:ml-[28%]">
                <Icons.xCircle className="h-4 w-4" />
                {userAuthErrorMsgFromCode(createAccountPasswordError?.code) ??
                  'Something went wrong'}
              </div>
            </div>
          )}

          {updateAccountPasswordError && (
            <div className="flex flex-col md:flex-row gap-2 md:items-center xl:w-2/3">
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0 md:ml-[28%]">
                <Icons.xCircle className="h-4 w-4" />
                {userAuthErrorMsgFromCode(updateAccountPasswordError?.code) ??
                  'Something went wrong'}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-2 items-center xl:w-2/3">
            <Button
              onClick={() => {
                if (!authMethods?.data?.methods?.includes('EMAIL')) {
                  handleCreatePassword()
                } else {
                  updateAccountPassword({
                    password: oldPassword.value,
                    newPassword: confirmPassword.value,
                  })
                }
              }}
              loading={createAccountPasswordLoading || updateAccountPasswordLoading}
              className="ml-auto gap-2"
              variant="default"
              size={'sm'}
              disabled={
                password?.value !== confirmPassword?.value ||
                !upperCaseRegex.test(password.value) ||
                !lowerCaseRegex.test(password.value) ||
                !numberRegex.test(password.value) ||
                !upperCaseRegex.test(confirmPassword.value) ||
                !lowerCaseRegex.test(confirmPassword.value) ||
                !numberRegex.test(confirmPassword.value) ||
                password.value.length < 8 ||
                confirmPassword.value.length < 8
              }
            >
              {!createAccountPasswordLoading && <Icons.save className="h-4 w-4" />}
              Save
            </Button>
          </div>
        </div>
      </PersonalSettingsLayout>
    </div>
  )
}

export default PasswordSection
