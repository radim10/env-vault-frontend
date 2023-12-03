'use client'

import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import { Input } from '../ui/input'
import { useEmailLogin } from '@/api/mutations/auth'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { saveSession } from '@/app/actions'
import { emailLoginErrorMsgFromCode } from '@/api/requests/auth'

interface Props {
  onCancel: () => void
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const upperCaseRegex = /[A-Z]/
const lowerCaseRegex = /[a-z]/
const numberRegex = /\d/

const EmailLoginCard: React.FC<Props> = ({ onCancel }) => {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null)

  const [password, setPassword] = useImmer<{
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
  } = useEmailLogin({
    onSuccess: async (data) => {
      await saveSession(data)
      router.replace(`/workspace`)
    },
  })

  const handleLogin = () => {
    //  check if password is valid
    const passsValid =
      upperCaseRegex.test(password.value) &&
      lowerCaseRegex.test(password.value) &&
      numberRegex.test(password.value) &&
      password.value.length >= 10

    setPasswordValid(passsValid)

    if (!passsValid) return

    login({ email, password: password.value })
  }

  return (
    <div>
      <Card className="sm:w-[460px] w-[90vw]">
        <CardContent className="pt-5 md:px-8">
          <div className="flex flex-col gap-5">
            <div className="flex justify-center items-center">LOGO</div>
            <Link href="/login">
              <button
                className="mb-0 flex gap-2 items-center opacity-70 hover:opacity-100 hover:text-primary ease duration-100 text-[0.9rem]"
                onClick={() => onCancel()}
              >
                <span>
                  <Icons.arrowLeft className="h-4 w-4" />
                </span>

                <span>Go back</span>
              </button>
            </Link>

            {/**/}
            <div>
              <div className="font-semibold text-lg">Log in with email</div>
              <div className="text-muted-foreground text-[0.9rem]">
                Eenter your email and password
              </div>
            </div>
            {/**/}

            <div className="flex flex-col gap-3 -mt-0">
              <div className="mt-2">
                <Input
                  disabled={isLoading}
                  type={'email'}
                  placeholder="Enter your email"
                  className="pr-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mt-0">
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
            </div>

            {error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                {emailLoginErrorMsgFromCode(error?.code) ?? 'Something went wrong'}
              </div>
            )}

            {passwordValid === false && !error && (
              <div className="text-red-600 text-[0.92rem] flex items-center gap-2 mt-0">
                <Icons.xCircle className="h-4 w-4" />
                Invalid email or password
              </div>
            )}
            <Button
              size={'sm'}
              type="submit"
              disabled={!emailRegex.test(email)}
              onClick={() => {
                if (!emailRegex.test(email)) return
                handleLogin()
              }}
            >
              Log in
            </Button>
            {/**/}

            <div className="mt-2 flex items-center justify-between text-muted-foreground text-[0.9rem]">
              <div className="">
                Don't have an account?
                <span>
                  <Link href="/signup">
                    <Button variant="link" className="pl-1.5">
                      Sign up
                    </Button>
                  </Link>
                </span>
              </div>
              <div>
                <Link href="/forgot-password">
                  <Button variant="link" className="pl-1.5">
                    Reset password
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailLoginCard
