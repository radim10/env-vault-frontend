'use client'

import Link from 'next/link'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useState } from 'react'
import clsx from 'clsx'
import { useImmer } from 'use-immer'
import { useEmaiLSignUp } from '@/api/mutations/auth'
import { authRegex, passwordRules } from '@/utils/auth/auth'
import { emailSignUpErrorMsgFromCode } from '@/api/requests/auth'

interface Props {
  onCancel: () => void
}

const EmailSignUp: React.FC<Props> = ({ onCancel }) => {
  const [step, setStep] = useState(1)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

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
    mutate: handleSignUp,
    isLoading,
    error,
    reset,
  } = useEmaiLSignUp({
    onSuccess: () => setStep(3),
  })

  return (
    <div>
      <Card className="sm:w-[460px] w-[90vw]">
        <CardContent className="pt-5 px-8">
          <div className="flex flex-col gap-5">
            <div className="flex justify-center items-center">LOGO</div>
            {step !== 3 && (
              <button
                className="mb-0 flex gap-2 items-center opacity-70 hover:opacity-100 hover:text-primary ease duration-100 text-[0.9rem]"
                onClick={() => {
                  if (step === 1) {
                    onCancel()
                  } else setStep(step - 1)
                }}
              >
                <span>
                  <Icons.arrowLeft className="h-4 w-4" />
                </span>

                <span>Go back</span>
              </button>
            )}

            {step === 1 && (
              <>
                <div>
                  <div className="font-semibold text-lg">Sign up with email</div>
                  <div className="text-muted-foreground text-[0.9rem]">
                    Provide information in form below
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <div className="ml-1 mb-1">
                      <Label htmlFor="name">Full name</Label>
                    </div>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                      }}
                    />
                  </div>

                  <div>
                    <div className="ml-1 mb-1">
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <Input
                      type="email"
                      id="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                      }}
                    />
                  </div>
                </div>
                <Button
                  size={'sm'}
                  type="submit"
                  disabled={!authRegex.email.test(email) || name?.trim()?.length === 0}
                  onClick={() => {
                    if (authRegex.email.test(email) && name?.trim()?.length > 0) {
                      setStep(2)
                    }
                  }}
                >
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <div className="font-semibold text-lg">Set password</div>
                  <div className="text-muted-foreground text-[0.9rem]">for {email}</div>
                </div>

                <div className="flex flex-col gap-3 -mt-1">
                  <div className="flex flex-col gap-1">
                    {passwordRules.map(({ name, check }) => (
                      <div
                        className={clsx(
                          ['flex gap-2 items-center text-[0.95rem] ease duration-200'],
                          {
                            'text-green-600': check(password?.value),
                            'opacity-90': !check(password?.value),
                          }
                        )}
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

                  <div>
                    <div className="w-full flex justify-end items-center relative">
                      <Input
                        disabled={isLoading}
                        type={confirmPassword.visible ? 'text' : 'password'}
                        placeholder="Enter your password again"
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
                            'cursor-pointer hover:text-primary':
                              confirmPassword?.value?.length !== 0,
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
                {/* // TODO: ERROR */}

                {error && (
                  <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                    <Icons.xCircle className="h-4 w-4" />
                    {emailSignUpErrorMsgFromCode(error?.code)}
                  </div>
                )}

                <Button
                  size={'sm'}
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
                    handleSignUp({ name, email, password: password.value })
                  }}
                >
                  Confirm
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <div className="flex gap-2 items-center md:justify-center">
                    <div className="font-semibold text-lg">Please check your inbox</div>
                    <Icons.mailOpen className="h-5 w-5" />
                  </div>
                  <div className="text-muted-foreground text-[0.9rem] md:text-center mt-2">
                    We have just sent you confirmation email (it may take up to few minutes to
                    arrive)
                  </div>
                </div>

                <div className="mt-2 flex justify-center">
                  <Link href="/login" className="">
                    <Button variant={'link'}>Back to login</Button>
                  </Link>
                </div>
              </>
            )}

            {step !== 3 && (
              <div className="text-muted-foreground text-[0.9rem]">
                Already have an account?
                <span>
                  <Link href="/login">
                    <Button variant="link" className="pl-1.5">
                      Login
                    </Button>
                  </Link>
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailSignUp
