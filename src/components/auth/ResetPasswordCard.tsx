'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useImmer } from 'use-immer'
import { Input } from '../ui/input'
import { useResetPassword } from '@/api/mutations/auth'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { emailLoginErrorMsgFromCode, resetPasswordErrorMsgFromCode } from '@/api/requests/auth'
import { authRegex, passwordRules } from '@/utils/auth/auth'

interface Props {
  token: string
}

const ResetPasswordCard: React.FC<Props> = ({ token }) => {
  const router = useRouter()

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
    error,
    isLoading,
    mutate: login,
    status,
  } = useResetPassword({
    onSuccess: async (data) => {
      // router.replace(`/log`)
    },
  })

  const handleResetPassword = () => {
    //  check if password is valid
    const passsValid =
      authRegex.password.upperCase.test(password.value) &&
      authRegex.password.lowerCase.test(password.value) &&
      authRegex.password.number.test(password.value) &&
      password.value.length >= 10

    if (!passsValid) return

    login({ password: password.value, token })
  }

  const goToLogin = () => {
    router.replace('/login')
  }

  if ((error && error?.code) || status === 'success') {
    return (
      <Card className="sm:w-[460px] w-[90vw]">
        <CardContent className="pt-5 md:px-8">
          <div className="flex flex-col gap-5">
            <div className="flex justify-center items-center">LOGO</div>

            {error && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-2 items-center">
                  <div className="font-semibold text-lg text-red-600">Password reset failed</div>
                  <Icons.xCircle className="text-red-600 h-5 w-5" />
                </div>

                <div className="mt-0 text-[1rem] opacity-90">
                  {resetPasswordErrorMsgFromCode(error?.code)}
                </div>
              </div>
            )}

            {!error && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-2 items-center">
                  <div className="font-semibold text-lg text-green-600">Password reseted</div>
                  <Icons.checkCircle2 className="text-green-600 h-5 w-5" />
                </div>
                <div className="mt-0 text-[1rem] opacity-90">
                  Now you can login with your new password
                </div>
              </div>
            )}

            <div className="mt-5">
              <Button size={'sm'} className="w-full" onClick={goToLogin}>
                Go to login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <Card className="sm:w-[460px] w-[90vw]">
        <CardContent className="pt-5 md:px-8">
          <div className="flex flex-col gap-5">
            <div className="flex justify-center items-center">LOGO</div>
            <Link href="/login">
              <button className="mb-0 flex gap-2 items-center opacity-70 hover:opacity-100 hover:text-primary ease duration-100 text-[0.9rem]">
                <span>
                  <Icons.arrowLeft className="h-4 w-4" />
                </span>

                <span>Back to login</span>
              </button>
            </Link>

            {/**/}
            <div>
              <div className="font-semibold text-lg">Reset your password</div>
              <div className="text-muted-foreground text-[0.9rem]">
                Enter your new password below
              </div>
            </div>
            {/**/}

            <div className="flex flex-col gap-3 -mt-0">
              <div className="flex flex-col gap-1">
                {passwordRules.map(({ name, check }) => (
                  <div
                    className={clsx(['flex gap-2 items-center text-[0.95rem] ease duration-200'], {
                      'text-green-600': check(password?.value),
                      'opacity-90': !check(password?.value),
                    })}
                  >
                    <Icons.checkCircle2 className="h-4 w-4" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <div className="w-full flex justify-end items-center relative">
                  <Input
                    disabled={isLoading}
                    type={password.visible ? 'text' : 'password'}
                    placeholder="New password"
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

              <div className="mt-0">
                <div className="w-full flex justify-end items-center relative">
                  <Input
                    disabled={isLoading}
                    type={confirmPassword.visible ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    className="pr-10"
                    value={confirmPassword.value}
                    onChange={(e) =>
                      setConfirmPassword((draft) => {
                        draft.value = e.target.value
                      })
                    }
                  />
                  <button
                    disabled={confirmPassword?.value?.length === 0}
                    className={clsx(
                      [
                        'absolute ease duration-200 w-8 h-8 mr-2 flex justify-center items-center gap-2 md:gap-3.5',
                      ],
                      {
                        'opacity-50': confirmPassword?.value?.length === 0,
                        'cursor-pointer hover:text-primary': confirmPassword?.value?.length !== 0,
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
            </div>

            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {emailLoginErrorMsgFromCode(error?.code) ?? 'Something went wrong'}
              </div>
            )}

            {/* {passwordValid === false && !error && ( */}
            {/*   <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0"> */}
            {/*     <Icons.xCircle className="h-4 w-4" /> */}
            {/*     Invalid email or password */}
            {/*   </div> */}
            {/* )} */}
            <Button
              size={'default'}
              type="submit"
              loading={isLoading}
              disabled={
                password?.value !== confirmPassword?.value ||
                !authRegex.password.upperCase.test(password.value) ||
                !authRegex.password.lowerCase.test(password.value) ||
                !authRegex.password.number.test(password.value) ||
                !authRegex.password.upperCase.test(confirmPassword.value) ||
                !authRegex.password.lowerCase.test(confirmPassword.value) ||
                !authRegex.password.number.test(confirmPassword.value) ||
                password.value.length < 10 ||
                confirmPassword.value.length < 10
              }
              onClick={() => {
                if (
                  password?.value !== confirmPassword?.value ||
                  !authRegex.password.upperCase.test(password.value) ||
                  !authRegex.password.lowerCase.test(password.value) ||
                  !authRegex.password.number.test(password.value) ||
                  !authRegex.password.upperCase.test(confirmPassword.value) ||
                  !authRegex.password.lowerCase.test(confirmPassword.value) ||
                  !authRegex.password.number.test(confirmPassword.value) ||
                  password.value.length < 10 ||
                  confirmPassword.value.length < 10
                )
                  return

                handleResetPassword()
              }}
            >
              Confirm password
            </Button>
            {/**/}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswordCard
