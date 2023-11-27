'use client'

import clsx from 'clsx'
import { Icons } from '../icons'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useImmer } from 'use-immer'
import PersonalSettingsLayout from './Layout'
import { useCreateAccountPassword } from '@/api/mutations/userAccount'
import { userAccountErrorMsgFromCode } from '@/api/requests/userAccount'

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
  } = useCreateAccountPassword()

  const handleCreatePassword = () => {
    createAccountPassword({ password: password.value })
  }

  return (
    <div>
      <PersonalSettingsLayout
        description="If you set password you will be able to use it to login"
        title="Password"
        icon={Icons.squareAsterisk}
      >
        <div className="flex flex-col gap-4 justify-center w-full">
          <div className="md:mb-2 flex flex-col md:flex-row gap-2 md:items-center lg:w-2/3 w-full">
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

          <div className="flex flex-col md:flex-row gap-2 md:items-center lg:w-2/3">
            <div className="md:w-[35%]">
              <Label>Password</Label>
            </div>
            <div className="w-full flex justify-end items-center relative">
              <Input
                disabled={createAccountPasswordLoading}
                type={password.visible ? 'text' : 'password'}
                placeholder="Enter your password"
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
                    'absolute ease duration-200 hover:text-primary w-8 h-8 mr-2 flex justify-center items-center gap-2 md:gap-3.5',
                  ],
                  {
                    'opacity-50': password?.value?.length === 0,
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

          <div className="flex flex-col md:flex-row gap-2 md:items-center lg:w-2/3">
            <div className="md:w-[35%]">
              <Label>Confirm password</Label>
            </div>
            <div className="w-full flex justify-end items-center relative">
              <Input
                disabled={createAccountPasswordLoading}
                type={confirmPassword.visible ? 'text' : 'password'}
                placeholder="Enter your password again"
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
                    'absolute ease duration-200 hover:text-primary w-8 h-8 mr-2 flex justify-center items-center gap-2 md:gap-3.5',
                  ],
                  {
                    'opacity-50': confirmPassword?.value?.length === 0,
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
            <div className="flex flex-col md:flex-row gap-2 items-center lg:w-2/3">
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0 md:ml-[28%]">
                <Icons.xCircle className="h-4 w-4" />
                {userAccountErrorMsgFromCode(createAccountPasswordError?.code) ??
                  'Something went wrong'}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-2 items-center lg:w-2/3">
            <Button
              onClick={handleCreatePassword}
              loading={createAccountPasswordLoading}
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
